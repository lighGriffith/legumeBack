var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var Commande =require('../models/commande');
var Produit = require('../models/produit')

router.post('/signup', function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
  } else {
    console.log(req.body);
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      name:req.body.name,
      lat     : req.body.lat,
      lng    :req.body.lng,
      telephone    : req.body.telephone,
      typeFermier :req.body.typeFermier,
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        console.log(err);
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

router.post('/signin', function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), config.secret, {
            expiresIn: 604800 // 1 week
          });
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

router.get('/signout', passport.authenticate('jwt', { session: false}), function(req, res) {
  req.logout();
  res.json({success: true, msg: 'Sign out successfully.'});
});

router.post('/produit', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var produit = new Produit({
      nom: req.body.nom,
      quantite: req.body.quantite,
      prix: req.body.prix,
      username: req.body.username,
    });

    produit.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Save Produit failed.'});
      }
      res.json({success: true, msg: 'Successful created new Produit.'});
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.get('/produit', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Produit.find(function (err, produits) {
      if (err) return next(err);
      res.json(produits);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

// service pour user.
router.post('/user/:username/produit', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);

  if (token) {
    var username = req.params.username;
    var produit = new Produit({
      nom: req.body.nom,
      quantite: req.body.quantite,
      prix: req.body.prix,
      username: username,
    });

    produit.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Save Produit failed.'});
      }
      res.json({success: true, msg: 'Successful created new Produit.'});
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.get('/user/:username/produit', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var username = req.params.username;
    Produit.find({ username: username },function (err, produits) {
      if (err) return next(err);
      res.json(produits);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});


getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
