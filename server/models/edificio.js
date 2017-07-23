// building model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Edificio = new Schema({
	nome: String,
  	descricao: String,
  	atividade: String,
	caracteristicasFisicas: {
		localizacao: { setor: String, bloco: String },
		area: Number,
		n_pavimentos: Number,
		ocupacaoMedia: Number,
		n_baciasSanitarias: Number,
		n_torneiras: Number,
		n_duchas: Number,
		n_chuveiros: Number,
		n_pias: Number,
		volumeReservatorio: Number
	},
	consumoDiario: [{ dia: Date, consumo: Number }],
	geolocalizacao: {latitude: Number, longitude: Number}
});

Edificio.static('findBySetor', function (setor, callback) {
	return this.find( { 'caracteristicasFisicas.localizacao.setor': setor }, callback  )
});

module.exports = mongoose.model('edificios', Edificio);