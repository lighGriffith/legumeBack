var Produit = require('../../models/produit');
var Commande =require('../../models/commande');
var passportController=require('./passportController');
var validator=require('../validator/validator');
let controller={};

controller.post= async function(req, res,next) {
  if(passportController.checkToken(req.headers)){
    var idUser = req.params.id_user;
    var produit = new Produit({nom: req.body.nom,quantite: req.body.quantite,quantiteInitiale:req.body.quantite,prix: req.body.prix,idUser: idUser});
    var validMessage=validator.validate(produit,"produit");
    if(validMessage!==true){
      res.json({success: false, error:{type:"validation",liste_erreur:validMessage}});
    }else{
      try{
        let product = await produit.save();
        res.json({success: true, produit: product});
      }catch(err){
        res.json({success: false, msg: 'Save Produit failed.'});
      }
    }
  }else{
    res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

controller.get= async function(req, res,next) {
  if(passportController.checkToken(req.headers)){
    try{
      let product = await Produit.find({ idUser: req.params.id_user });
      res.json(product);
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
        let ancienProduit = await Produit.findByIdAndRemove(req.params.id_produit);
        if(!ancienProduit){
          res.status(404).send({success: false, msg: 'Product not found.'})
        }else{
          if(ancienProduit){
            let commandes = await Commande.deleteMany({'idProduit':req.params.id_produit });
            if(commandes){
              res.json({success: true, msg: 'Product successfully deleted.'});
            }else{
              res.json({success: false, msg: 'Probelm to delete commande'});
            }
          }
        }
      }catch(erreur){
        return next(erreur);
      }
  }else{
    res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

controller.put= async function(req, res,next) {
  if(passportController.checkToken(req.headers)){
    var idUser = req.params.id_user;
    var produit = new Produit({nom: req.body.nom,quantite: req.body.quantite,quantiteInitiale:req.body.quantite,prix: req.body.prix,idUser: idUser});
    var validMessage=validator.validate(produit,"produit");
    if(validMessage!==true){
      res.json({success: false, error:{type:"validation",liste_erreur:validMessage}});
    }else{
      if(req.params.id_produit){
        try{
          const doc = await Produit.findOne({_id:req.params.id_produit});
          if(produit.nom) doc.nom=produit.nom;
          if(produit.quantite) doc.quantite=produit.quantite;
          if(produit.prix) doc.prix=produit.prix;
          if(produit.idUser) doc.idUser=produit.idUser;
          await doc.save();
          res.json({success: true, produit: doc});
        }catch(erreur){
          res.json({success: false, msg: 'Update Produit failed.'});
        }
      }else{
        res.json({success: false, msg: 'No id Product to update.'});
      }
    }
  }else{
    res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

module.exports = controller;
