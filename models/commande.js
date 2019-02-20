var mongoose = require('mongoose');
var Schema=mongoose.Schema;

var CommandeSchema = new Schema({
    idAcheteur: { type: String, default: "" },
});

module.exports = mongoose.model('commande', CommandeSchema,'commande');