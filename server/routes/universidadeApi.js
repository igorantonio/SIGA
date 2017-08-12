var express = require('express');
var router = express.Router();
var passport = require('passport');
var EstatisticaAPI = require('./estatisticaApi.js');
var User = require('../models/user.js');
var Edificio = require('../models/edificio.js');

router.get('/universidade', function (req, res) {

    var nome = "UFCG";
    var atividade = "Minha atividade";
    var descricao = "Universidade Federal de Campina Grande. Aqui é a descrição.";
    var numeroPredios = 0;
    var localizacao;
    var area;
    var consumos = [];
    var mediaEsperada = 40;

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

        var jsonMe = {
            "estatisticas": consumoEstatisticas,
            "infos": {
                "nome": nome,
                "atividade": atividade,
                "descricao": descricao
            },
            "consumos": consumos
        };

        res.json(jsonMe);
    })
});

router.get('/universidade/consumo', function (req, res) {

    var consumos = [];

    Edificio.find({}, function (error, edificios) {

        if (error) {
            res.send("ERROR!")
            return;
        };

        edificios.forEach(function (edificio) {

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

        res.json(consumos);
    })
});

module.exports = router;
