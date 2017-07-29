// building model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Edificio = new Schema({
	nome: {type: String, required: true, minlength: 1},
  	descricao: {type: String, required: true, default: "Nenhuma descrição informada", minlength:10},
  	atividade: {type:String, required: true, default: "Desconhecida", minlength:3},
	caracteristicasFisicas: {
		localizacao: { setor: String, bloco: {type:String, required:true} },
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
	consumoDiario: [{ dia: {type: Date, required: true}, consumo: {type: Number, required: true} }],
	geolocalizacao: {latitude: {type: Number, required: true}, longitude: {type:Number, required: true}}
});

Edificio.static('findBySetor', function (setor, callback) {
	return this.find( { 'caracteristicasFisicas.localizacao.setor': setor }, callback  )
});

module.exports = mongoose.model('edificios', Edificio);