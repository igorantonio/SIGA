var express = require('express');
var router = express.Router();
var passport = require('passport');
var EstatisticaAPI = require('./estatisticaApi.js');
var User = require('../models/user.js');
var Edificio = require('../models/edificio.js');
var Conta = require('../models/contaDeAgua');
var EdificioAPI = require('./edificioApi.js');


router.get('/universidade', function(req, res) {

    var nome = "UFCG";
    var atividade = "Minha atividade";
    var descricao = "Universidade Federal de Campina Grande. Aqui é a descrição.";
    var numeroPredios = 0;
    var localizacao;
    var area;
    var consumos = [];
    var mediaEsperada = 40;

    Edificio.find({}, function(error, edificios) {

        if (error) {
            res.send("ERROR!")
            return;
        };

        edificios.forEach(function(edificio) {

            numeroPredios++;

            // SOMA CONSUMOS DE TODOS OS PRÉDIOS POR DATA
            edificio.historicoConsumo.forEach(function(c) {

                temData = false;
                consumos.forEach(function(ct) {
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

router.get('/universidade/consumo', function(req, res) {

    Edificio.find({}, function(error, edificios) {

        if (error) {
            res.send("ERROR!")
            return;
        };

        var consumos = [];
        edificios.forEach(function(edificio) {

            edificio.historicoConsumo.forEach(function(c) {

                temData = false;
                consumos.forEach(function(ct) {
                    if (ct.x === c.data.getTime()) {
                        ct.y = ct.y + c.consumo;
                        temData = true;
                    }
                });

                if (!temData) {
                    var newConsumo = {
                        data: c.data.getTime(),
                        consumo: c.consumo
                    };
                    consumos.push(newConsumo);
                }
            });
        });

        console.log(consumos);

        if (req.query.granularidade != null) {
            consumos = EdificioAPI.data.granularidade(consumos, req.query.granularidade);
        } else {
            consumos = EdificioAPI.data.granularidade(consumos, 'day');
        };
        console.log(consumos);

        consumosFiltrados = [];
        for (key in consumos) {
            var newConsumo = {
                x: new Date(key).getTime(),
                y: consumos[key]
            };
            consumosFiltrados.push(newConsumo);
        };


        consumosFiltrados.sort(function(a, b) {
            return a.x - b.x;
        });
        res.json(consumosFiltrados);

    })
});

// Index(ContaDeAgua)
router.get('/universidade/contaDeAgua', function(req, res) {
    Conta.find({}, function(err, contas) {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            res.status(200).json(contas);
        }
    });
});

// Show(ContaDeAgua)
router.get('/universidade/contaDeAgua/:conta_id', function(req, res) {
    Conta.findById(req.params.conta_id, function(err, conta) {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            res.status(200).json(conta);
        }
    });
});

// Create(ContaDeAgua)
router.post('/universidade/contaDeAgua', function(req, res) {
    var conta = new Conta();
    if (req.body.valor < 0) {
        res.status(400).send("Valor deve ser positivo.");
    }
    conta.valor = req.body.valor;

    if (!(req.body.mes >= 1 && req.body.mes <= 12)) {
        res.status(400).send("Mês invalido.");
    }
    conta.mes = req.body.mes;

    if (req.body.dataDePagamento) conta.dataDePagamento = req.body.dataDePagamento;

    conta.save(function(err) {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            res.status(200).json(conta);
        }
    });
});

// Update(ContaDeAgua)
router.put('/universidade/contaDeAgua/:conta_id', function(req, res) {
    Conta.findById(req.params.conta_id, function(err, conta) {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            if (req.body.valor) {
                if (req.body.valor < 0) {
                    res.status(400).send("Valor deve ser positivo.");
                }
                conta.valor = req.body.valor;
            }

            if (req.body.mes) {
                if (!(req.body.mes >= 1 && req.body.mes <= 12)) {
                    res.status(400).send("Mês invalido.");
                }
                conta.mes = req.body.mes;
            }

            if (req.body.dataDePagamento) conta.dataDePagamento = req.body.dataDePagamento;

            conta.save(function(err) {
                if (err) {
                    res.status(400).json({ error: err });
                } else {
                    res.status(200).json(conta);
                }
            });
        }
    });
});

// Delete(ContaDeAgua)
router.delete('/universidade/contaDeAgua/:conta_id', function(req, res) {
    Conta.remove({_id: req.params.conta_id}, function(err) {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            res.status(200).send("Conta de água removida.");
        }
    });
});

module.exports = router;