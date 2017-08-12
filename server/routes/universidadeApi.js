var express = require('express');
var router = express.Router();
var passport = require('passport');
var EstatisticaAPI = require('./estatisticaApi.js');
var User = require('../models/user.js');
var Edificio = require('../models/edificio.js');

var sumObjectsByKey = function (a, b) {
    return Array.from(arguments).reduce((a, b) => {
        for (let k in b) {
            if (b.hasOwnProperty(k)) {
                
                a[k] = (a[k] || 0) + b[k];
            }
        }
        return a;
    }, {});
};

router.get('/universidade', function (req, res) {

    var nome = "UFCG";
    var descricao = "Universidade Federal de Campina Grande. Aqui é a descrição.";
    var numeroPredios = 0;
    var localizacao;
    var area;
    var consumos = [];

    Edificio.find({}, function (error, edificios) {
        
        if (error) {
            res.send("ERROR!")
            return;
        };

        edificios.forEach(function (edificio) {
            
            numeroPredios++;
            
            // SOMA CONSUMOS DE TODOS OS PRÉDIOS POR DATA
            edificio.historicoConsumo.forEach(function (c) {
                                
                temData = false;
                consumos.forEach(function (ct) {                                     
                    if (ct.data.getTime() === c.data.getTime()) {
                        ct.consumo = ct.consumo + c.consumo;
                        temData = true;
                    }
                });

                if (!temData) {
                    consumos.push(c);
                }
            });
        });

        var consumoEstatisticas = EstatisticaAPI.data.calculaEstatisticas(consumos);
        
        var jsonMe = {"estatisticas":consumoEstatisticas}

        res.json(jsonMe);
    })
});

module.exports = router;


/* 
	mediaEsperada: {type: Number, required: true},
	historicoConsumo: [{ data: {type: Date, required: true}, consumo: {type: Number, required: true} }],
	geolocalizacao: {latitude: {type: Number, required: true}, longitude: {type:Number, required: true}},
    vazamentos: [{data:  {type: Date, required: true}, volume: {type: Number, required: true}}]

*/