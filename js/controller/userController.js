var User = require("../../models/user");
var validatorUser=require('../validator/validator');
var jwt = require('jsonwebtoken');
var config = require('../../config/indexDatabase');
var passportController=require('./passportController');
let controller={};

controller.test=function(req, res) {
  return res.json({success: true});
};

controller.getUsers = async function(req, res,next) {
    try{
      let users = await User.find({});
      res.json(users);
    }catch(err){
      return next(err);
    }
}


controller.signup=async function(req, res) {
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
      isFermier :  false,
      adresse : req.body.adresse,
      ville : req.body.ville
    });
    var validMessage=validatorUser.validate(newUser,"user");
    // save the user
    if(validMessage!==true){
      return res.json({success: false, error:{type:"validation",liste_erreur:validMessage}});
    }else{
      try{
        let user = await newUser.save();
        res.json({success: true, user: user});
      }catch(err){
        return res.json({success: false,error:{type:"mongo" ,msg: 'Username already exists.'}});
      }
    }
  }
};


controller.signin= async function(req, res) {
  try{
    let user= await User.findOne({email: req.body.email});
    if (!user) {
      res.json({success: false, error:{message: 'Authentication failed. User not found.'}});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch) {
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
  }catch(err){
    throw err;
  }
};

controller.signout= function(req, res) {
  //ne fait rien pour le moment
  res.json({success: true, msg: 'Sign out successfully.'});
}

controller.getInfoUser = async function(req, res,next) {
  if(passportController.checkToken(req.headers)){
      var username = req.params.username;
      try{
        let user = await User.find({ username: username });
        res.json(user);
      }catch(err){
        return next(err);
      }
  }else{
    res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}


module.exports = controller;
