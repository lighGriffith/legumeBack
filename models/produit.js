var mongoose = require('mongoose');
var Schema=mongoose.Schema;

var ProduitSchema = new Schema({
    nom: { type: String,required: true },
    quantite: { type: Number,required: true },
    quantiteInitiale: { type: Number,required: true },
    prix: { type: Number,required: true },
    idUser: { type: String,required: true }
});

module.exports = mongoose.model('produits', ProduitSchema,'produits');
