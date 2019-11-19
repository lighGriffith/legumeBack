
var Commande =require('../../models/commande');
var User = require('../../models/user');
var Produit =require('../../models/produit');
var passportController=require('./passportController');
var validator=require('../validator/validator');
let controller={};

controller.post= async function(req, res,next) {
  if(passportController.checkToken(req.headers)){
    var idUser = req.params.id_user;
    var commande = new Commande({idAcheteur: idUser,quantite: req.body.quantite,prix: req.body.prix,idVendeur: req.body.idVendeur,idProduit:req.body.idProduit});
    var validMessage=validator.validate(commande,"commande");
    if(validMessage!==true){
      res.json({success: false, error:{type:"validation",liste_erreur:validMessage}});
    }else{
      try{
        let produit = await Produit.findOneAndUpdate({ _id: commande.idProduit,idUser:commande.idVendeur,quantite:{$gt: commande.quantite} }, {  $inc: { quantite: -commande.quantite }  }, { new: true });
        if(produit && produit.quantite){
          try{
            let commandeSuccess = await commande.save();
            res.json({success: true, commande: commandeSuccess});
          }catch(errorCommande){
            res.json({success: false, msg: 'Save Commande failed.'});
          }
        }else{
          res.json({success: false, error:{type:"fonctionelle",number:"0"}});
        }
      }catch(err){
        return next(err);
      }
    }
  }else{
    res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

controller.get= async function(req, res,next) {
  if(passportController.checkToken(req.headers)){
      var idUser = req.params.id_user;
      var commande={};
      if(req.params.is_vendeur=="is_vendeur"){
        commande.idVendeur=req.params.id_user;
      }else{
        commande.idAcheteur=req.params.id_user;
      }
      try{
        let commandes = await Commande.find(commande).lean().exec();
        var promisses=[];
        for (let key in commandes) {
          let commande=commandes[key];
          promisses.push(new Promise(function (resolve, reject) {
            User.findById(commande.idVendeur).lean().exec(function (err, user) {
              if (!err&&user){
                user.password=undefined;
                commande.infoVendeur=user;
                resolve();
              }else{
                resolve();
              }
            });
          }));
        }
        Promise.all(promisses).then(function(values) {
          res.json(commandes);
        });
      }catch(err){
        return next(err);
      }
  }else{
    res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

controller.delete= async function(req, res,next) {
  if(passportController.checkToken(req.headers)){
      var idUser = req.params.id_user;
      try{
        let commande = await Commande.findByIdAndRemove(req.params.id_commande);
        if(commande){
          let produit = await Produit.findOneAndUpdate({ _id: commande.idProduit, idUser: commande.idVendeur}, {  $inc: { quantite: +commande.quantite }  }, { new: true });
          if(produit){
            res.json({success: true, msg: 'La commande a bien été supprimée.'});
          }else{
            let newCommande = await commande.save();
            if(newCommande){
              res.json({success: false, msg: 'nothing has been done'});
            }else{
              res.json({success: false, msg: 'Bug commande deleted but product not reinitialized'});
            }
          }
        }else{
          res.json({success: false, msg: 'Commande not found.'});
        }
      }catch(err){
        return next(err);
      }
  }else{
    res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

controller.put= function(req, res,next) {
  if(passportController.checkToken(req.headers)){
    var commande = new Commande({idAcheteur: req.body.idAcheteur,quantite: req.body.quantite,prix: req.body.prix,idVendeur: req.body.idVendeur,idProduit:req.body.idProduit});
    var validMessage=validator.validate(commande,"commande");
    if(validMessage!==true){
      res.json({success: false, error:{type:"validation",liste_erreur:validMessage}});
    }else{
      Produit.findOneAndUpdate({ _id: commande.idProduit,idUser:commande.idVendeur,quantite:{$gt: commande.quantite} }, {  $inc: { quantite: -commande.quantite }  }, { new: true }, function(err, produit) {
        if (err) return next(err);
        if(produit.quantite){
          commande.save(function(err) {
            if (err) {
              res.json({success: false, msg: 'Save Commande failed.'});
            }
            res.json({success: true, commande: commande});
          });
        }else{
          res.json({success: false, error:{type:"fonctionelle",number:"0"}});
        }
      });
    }
  }else{
    res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

module.exports = controller;
