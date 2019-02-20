var mongoose = require('mongoose');
var Schema=mongoose.Schema;

var ProduitSchema = new Schema({
    nom: { type: String, default: "" },
    quantite: { type: String, default: "" },
    prix: { type: String, default: "" },
    username: { type: String, default: "" }
});

module.exports = mongoose.model('produits', ProduitSchema,'produits');
