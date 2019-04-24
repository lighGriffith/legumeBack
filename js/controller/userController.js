var User = require("../../models/user");
var validatorUser=require('../validator/validator');
var jwt = require('jsonwebtoken');
var config = require('../../config/indexDatabase');
var passportController=require('./passportController');
let controller={};

controller.test=function(req, res) {
  return res.json({success: true});
};

controller.signup=function(req, res) {
  console.log(req.body);
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email:req.body.email,
      lat     : req.body.lat,
      lng    :req.body.lng,
      telephone    : req.body.telephone,
      isFermier :  false
    });
    console.log(newUser);
    var validMessage=validatorUser.validate(newUser,"user");
    // save the user
    if(validMessage!==true){
      return res.json({success: false, error:{type:"validation",liste_erreur:validMessage}});
    }else{
      console.log(newUser);
      newUser.save(function(err) {
        if (err) {
          console.log(err);
          return res.json({success: false,error:{type:"mongo" ,msg: 'Username already exists.'}});
        }
        res.json({success: true, user: newUser});
      });
    }
  }
};


controller.signin= function(req, res) {
  console.log(req.body);
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.json({success: false, error:{message: 'Authentication failed. User not found.'}});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), config.secret, {
            expiresIn: 604800 // 1 week
          });
          // return the information including token as JSON
          res.json({success: true,id:user._id, token: 'JWT ' + token});
        } else {
          res.json({success: false, error:{message: 'Authentication failed. Wrong password.'}});
        }
      });
    }
  });
};

controller.signout= function(req, res) {
  req.logout();
  res.json({success: true, msg: 'Sign out successfully.'});
}

controller.getInfoUser = function(req, res,next) {
  if(passportController.checkToken(req.headers)){
      var username = req.params.username;
      User.find({ username: username },function (err, user) {
        if (err) return next(err);
        res.json(user);
      });
  }else{
    res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}


module.exports = controller;
