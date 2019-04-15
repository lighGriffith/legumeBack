var mongoose = require('mongoose');
var Schema=mongoose.Schema;

var CommandeSchema = new Schema({
    idAcheteur: { type: String,required: true },
    idVendeur:{ type: String,required: true },
    idProduit:{type: String,required: true},
    quantite: { type: Number,required: true },
    prix: { type: Number,required: true }
});

module.exports = mongoose.model('commande', CommandeSchema,'commande');
