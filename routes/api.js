var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var userController=require('../js/controller/userController');
var produitController=require('../js/controller/produitController');
var commandeController=require('../js/controller/commandeController');
var passport = require('passport');
var config = require('../config/indexDatabase');
require('../config/passport')(passport)
var jwt = require('jsonwebtoken');

//USER
  //Inscription
  router.post('/signup', userController.signup);
  //simple test
  router.post('/test', userController.test);
  //Identification
  router.post('/signin', userController.signin);
  //Déconnexion
  router.get('/signout', userController.signout);
  //get user
  router.get('/users', userController.getUsers);
  //get user
  router.get('/user/:username/info', passport.authenticate('jwt', { session: false}), function(req,res,next){userController.getInfoUser(req,res,next);});

//PRODUIT
  //ajout d'un produit.
  router.post('/user/:id_user/produit', passport.authenticate('jwt', { session: false}), function(req,res,next){produitController.post(req,res,next);});
  //retrait de tous les produits pour un utilisateur.
  router.get('/user/:id_user/produit', passport.authenticate('jwt', { session: false}), function(req,res,next){produitController.get(req,res,next);});
  //suppression d'un produit pour un utilisateur.
  router.delete('/user/:id_user/produit/:id_produit', passport.authenticate('jwt', { session: false}), function(req,res,next){produitController.delete(req,res,next);});
  //update d'un produit
  router.put('/user/:id_user/produit/:id_produit', passport.authenticate('jwt', { session: false}), function(req,res,next){produitController.put(req,res,next);});

//COMMANDE
  //ajout d'une commande
  router.post('/user/:id_user/commande', passport.authenticate('jwt', { session: false}), function(req,res,next){commandeController.post(req,res,next);});
  //retrait de toutes les commandes d'un vendeur ou d'un acheteur
  router.get('/user/:id_user/commande/:is_vendeur', passport.authenticate('jwt', { session: false}), function(req,res,next){commandeController.get(req,res,next);});
  router.get('/user/:id_user/commande', passport.authenticate('jwt', { session: false}), function(req,res,next){commandeController.get(req,res,next);});
  //supprimer une commande spécifique
  router.delete('/user/:id_user/commande/:id_commande', passport.authenticate('jwt', { session: false}), function(req,res,next){commandeController.delete(req,res,next);});
  //update d'un produit
  router.put('/user/:id_user/commande/:id_commande', passport.authenticate('jwt', { session: false}), function(req,res,next){commandeController.put(req,res,next);});

module.exports = router;
