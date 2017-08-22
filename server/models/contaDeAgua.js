var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contaDeAgua = new Schema({
	mes: { type: Number, required: true },
	valor: { type: Number, required: true },
	dataDePagamento: { type: Date }
});

module.exports = mongoose.model('ContaDeAgua', contaDeAgua);