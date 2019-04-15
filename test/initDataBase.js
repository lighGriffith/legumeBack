var mongoose = require('mongoose');
var config = require('../config/indexDatabase');
mongoose.connect(config.database, { useCreateIndex: true, useNewUrlParser: true });
var Commande =require('../models/commande');
var Produit =require('../models/produit');
var User=require('../models/user');

var jdds={users:[]};
var users=[{
    "username": "quentin",
    "password": "quentin",
    "email":"quentin@quentin.com",
    "lat"     : "12,234567",
    "lng"    :"12,234567",
    "telephone"    : "0990298378",
    "isFermier" :true
  },{
      "username": "marie",
      "password": "marie",
      "email":"marie@marie.com",
      "lat"     : "12,234564",
      "lng"    :"12,234568",
      "telephone"    : "0990298378",
      "isFermier" :false
    },{
        "username": "adri",
        "password": "adri",
        "email":"adri@adri.com",
        "lat"     : "12,234567",
        "lng"    :"12,234570",
        "telephone"    : "0990298378",
        "isFermier" :false
      },
      {
          "username": "pierre",
          "password": "pierre",
          "email":"pierre@pierre.com",
          "lat"     : "12,234563",
          "lng"    :"12,234567",
          "telephone"    : "0990298378",
          "isFermier" :false
        }];

        var produits=[{
          nom: "carotte",
          quantite: 10,
          quantiteInitiale: 10,
          prix:3,
          idUser: "dada"
        },{
            nom: "radis",
            quantite: 10,
            quantiteInitiale: 10,
            prix:3,
            idUser: "dada"
            },{
              nom: "jambon",
              quantite: 10,
              quantiteInitiale: 10,
              prix:3,
              idUser: "dada"
              },{
                nom: "blé",
                quantite: 100,
                quantiteInitiale: 10,
                prix:3,
                idUser: "dada"
                },];
User.deleteMany({}, function(err) {});
Produit.deleteMany({}, function(err) {});
for(var ind in users){
  var user=new User(users[ind]);
  user.save(function(err) {
    if (err) {
      console.log(err);
    }
    console.log({success: true, user: user});
  });
  if(user.isFermier){
    for(var ind2 in produits){
      produits[ind2].idUser=user._id;
      var produit=new Produit(produits[ind2]);
      produit.save(function(err) {
        if (err) {
          console.log(err);
        }
        console.log({success: true, produit: produit});
      });
    }
  }
}
