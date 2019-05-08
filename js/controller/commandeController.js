
var Commande =require('../../models/commande');
var User = require('../../models/user');
var Produit =require('../../models/produit');
var passportController=require('./passportController');
var validator=require('../validator/validator');
let controller={};

controller.post= function(req, res,next) {
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

controller.get= function(req, res,next) {
  if(passportController.checkToken(req.headers)){
      var idUser = req.params.id_user;
      var commande={};
      if(req.params.is_vendeur=="is_vendeur"){
        commande.idVendeur=req.params.id_user;
      }else{
        commande.idAcheteur=req.params.id_user;
      }
      Commande.find(commande).lean().exec(function (err, commandes) {
        if (err) return next(err);
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

      });
  }else{
    res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

controller.delete= function(req, res,next) {
  if(passportController.checkToken(req.headers)){
      var idUser = req.params.id_user;
      Commande.findByIdAndRemove(req.params.id_commande ,function (err) {
        if (err) return next(err);
        res.json({success: true, msg: 'La commande a bien été supprimée.'});
      });
  }else{
    res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

module.exports = controller;
