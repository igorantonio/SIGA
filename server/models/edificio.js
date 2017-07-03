// building model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var caracteristicas = new Schema({
	localizacao: String,
	area: Number,
	pavimentos: Number,
	ocupacaoMedia: Number,
	baciasSanitarias: Number,
	torneiras: Number,
	duchas: Number,
	chuveiros: Number,
	pias: Number,
	volumeReservatorio: Number
})

var Edificio = new Schema({
  nome: String,
  descricao: String,
  atividade: String,
  caracteristicasFisicas = caracteristicas,
  consumoDeAgua: Schema,
  estatisticas: Schema
});

Building.plugin(passportLocalMongoose);


module.exports = mongoose.model('buildings', Building);