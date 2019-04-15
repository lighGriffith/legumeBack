var Produit = require('../../models/produit');
var passportController=require('./passportController');
var validator=require('../validator/validator');
let controller={};

controller.post= function(req, res,next) {
  if(passportController.checkToken(req.headers)){
    var idUser = req.params.id_user;
    var produit = new Produit({nom: req.body.nom,quantite: req.body.quantite,quantiteInitiale:req.body.quantite,prix: req.body.prix,idUser: idUser});
    var validMessage=validator.validate(produit,"produit");
    if(validMessage!==true){
      res.json({success: false, error:{type:"validation",liste_erreur:validMessage}});
    }else{
      produit.save(function(err) {
        if (err) {
          res.json({success: false, msg: 'Save Produit failed.'});
        }
        res.json({success: true, produit: produit});
      });
    }
  }else{
    res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

controller.get= function(req, res,next) {
  if(passportController.checkToken(req.headers)){
      var idUser = req.params.id_user;
      Produit.find({ idUser: idUser },function (err, produits) {
        if (err) return next(err);
        res.json(produits);
      });
  }else{
    res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

controller.delete= function(req, res,next) {
  if(passportController.checkToken(req.headers)){
      var idUser = req.params.id_user;
      Produit.findByIdAndRemove(req.params.id_produit ,function (err) {
        if (err) return next(err);
        res.json({success: true, msg: 'Le produit a bien été supprimé.'});
      });
  }else{
    res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

controller.put= function(req, res,next) {
  if(passportController.checkToken(req.headers)){
    var idUser = req.params.id_user;
    var produit = new Produit({nom: req.body.nom,quantite: req.body.quantite,quantiteInitiale:req.body.quantite,prix: req.body.prix,idUser: idUser});
    var validMessage=validator.validate(produit,"produit");
    if(validMessage!==true){
      res.json({success: false, error:{type:"validation",liste_erreur:validMessage}});
    }else{
      Produit.findOneAndUpdate({_id:req.params._id},req.params,function(err,numberAffected) {
        if (err) {
          res.json({success: false, msg: 'Update Produit failed.'});
        }
        res.json({success: true, produit: produit});
      });
    }
  }else{
    res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

module.exports = controller;
