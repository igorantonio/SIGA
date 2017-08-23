var express = require('express');
var router = express.Router();
var passport = require('passport');
var EstatisticaAPI = require('./estatisticaApi.js');
var EdificioAPI = require('./edificioApi.js');
var User = require('../models/user.js');
var CaixaDeAgua = require('../models/caixaDeAgua.js');



//CREATE
router.post('/caixa', function(req, res) {
    var caixa = new CaixaDeAgua();
    caixa.nome = req.body.nome;
    caixa.descricao = req.body.descricao;
    caixa.caracteristicasFisicas = req.body.caracteristicasFisicas;
    caixa.geolocalizacao = req.body.geolocalizacao;
    caixa.historicoConsumo = req.body.historicoConsumo;
    caixa.mediaEsperada = req.body.mediaEsperada;
    caixa.vazamentos = req.body.vazamentos;
    if (req.body.historicoConsumo == null) {
        caixa.historicoConsumo = [];
    };
    if (req.body.vazamentos == null) {
        caixa.vazamentos = [];
    }
    caixa.save(function(error) {
        if (error){ 
	 res.status(400).json({err: error});      
	}
        else res.json(caixa);
    });

});

//INDEX
router.get('/caixa', function(req, res) {
    CaixaDeAgua.find(function(err, caixas) {
        if (req.query.setor != null) {
            caixas = EdificioAPI.data.iltrarPorSetor(req.query.setor, caixas);
        }
        if (req.query.nivelAlerta != null) {
            nivelAlerta = req.query.nivelAlerta;
            if (nivelAlerta == "0") {
                margem = 0.2;
            } else if (nivelAlerta == "1") {
                margem = 0.3;
            };
            var result = EdificioAPI.emAlerta(caixas, margem);
            res.send(result);
            return;
        }
        if (req.query.withAlerta) {
            if (req.query.withAlerta == 'true') {
                var result0 = EdificioAPI.data.emAlerta(caixas, 0.2);
                var result1 = EdificioAPI.data.emAlerta(caixas, 0.3);
                res.json({
                    todos: caixas,
                    alerta0: result0,
                    alerta1: result1
                });
                return;
            }
        }
        if (err) {
             res.status(400).json({err: err});
        } else {
            res.json(caixas);
        }
    });
});

//SHOW
router.get('/caixa/:caixa_id', function(req, res) {
    CaixaDeAgua.findById(req.params.caixa_id, function(error, caixa) {
        if (error){ 
              res.status(400).json({err: error});
            }
              else{
            res.json(caixa);
          }
    });
});

//UPDATE
router.put('/caixa/:caixa_id', function(req, res) {
   	CaixaDeAgua.findById(req.params.caixa_id, function(error, caixa) {
        if (error) res.send(caixa);
        if (req.body.nome) caixa.nome = req.body.nome;
        if (req.body.descricao) caixa.descricao = req.body.descricao;
        if (req.body.geolocalizacao) caixa.geolocalizacao = req.body.geolocalizacao;
        if (req.body.caracteristicasFisicas) caixa.caracteristicasFisicas = req.body.caracteristicasFisicas;
        if (req.body.historicoConsumo) caixa.historicoConsumo = req.body.historicoConsumo; // Pessoalmente eu acho melhor que essa linha não exista;
        if (req.body.vazamentos) caixa.vazamentos = req.body.vazamentos;
        caixa.save(function(error) {
            if (error){ 
              res.status(400).json({err: error});
            }
              else{
            res.json(caixa);
          }
        });
    });
});

//DELETE
router.route('/caixa/:caixa_id')
    .delete(function(req, res) {
        CaixaDeAgua.remove({
            _id: req.params.caixa_id
        }, function(error) {
            if (error) {
            	 res.status(400).json({err: error});
            }
            res.json({
                message: "Prédio removido!"
            });
        });
    });


//VAZAMENTO
//SHOW
router.get('/caixa/:caixa_id/vazamentos', function(req, res) {
    CaixaDeAgua.findById(req.params.caixa_id, function(error, caixa) {
         if (error){ 
              res.status(400).json({err: error});
            }
              else{
            res.json(caixa);
          };
        // Filtrar
        //Checar com eles, se tiver dois vazamentos no mesmo dia. o que fazer? Juntar?
        vazamentosFiltrados = caixa.vazamentos;
        res.json(vazamentosFiltrados);
    })
});


// CREATE
router.post('/caixa/:caixa_id/vazamentos/new', function(req, res) {
    if (req.body.data == null) {
        res.status(400);
        res.send("Body is empty");
        return;
    };
    CaixaDeAgua.findById(req.params.caixa_id, function(error, caixa) {
        if (error) {
            res.status(400);
            res.send(error.message);
            return
        };
        data = new Date(req.body.data);
        novoVazamento = {
            data: data.setTime(data.getTime() + data.getTimezoneOffset() * 60 * 1000),
            volume: req.body.volume
        };
        caixa.vazamentos.push(novoVazamento);
        caixa.save(function(error) {
            if (error) {
                res.status(422);
                res.send(error.message);
                return;
            } else {
                res.json(caixa.vazamentos);
            }
        });
    });
});


// Update (Vazamento)
router.put('/caixa/:caixa_id/vazamentos/:vazamento_id', function(req, res) {
    CaixaDeAgua.findById(req.params.caixa_id, function(err, caixa) {
        if (err) {
            res.status(400).json({error: err});
        } else {
            vazamentosAtualizado = [];
            caixa.vazamentos.forEach(function(vazamento) {
                if (vazamento._id == req.params.vazamento_id) {
                    data = new Date(req.body.data);
                    if (req.body.data) vazamento.data       = data.setTime(data.getTime() + data.getTimezoneOffset() * 60 *1000);
                    if (req.body.volume) vazamento.volume = req.body.volume;
                }
                vazamentosAtualizado.push(vazamento);
            });
            caixa.vazamentos = vazamentosAtualizado;
            caixa.save(function(err) {
                if (err) {
                    res.status(400).json({error: err});
                } else {
                    res.status(200).json({message: 'Vazamento atualizado.'});
                }
            });
        }
    });
});



// DELETE
router.delete('/caixa/:caixa_id/vazamentos/:vazamento_id', function(req, res) {
    CaixaDeAgua.findById(req.params.caixa_id, function(error, caixa) {
         if (error){ 
              res.status(400).json({err: error});
          };
        vazamentosFiltrados = [];
        caixa.vazamentos.forEach(function(vazamento) {
            if (vazamento._id != req.params.vazamento_id) {
                vazamentosFiltrados.push(vazamento);
            }
        })
        caixa.vazamentos = vazamentosFiltrados;
        caixa.save(function(error) {
            if (error){ 
              res.status(400).json({err: error});
            } else {
                res.json(caixa.vazamentos);
            }

        })
    });


});


//CONSUMO
//SHOW
router.get('/caixa/:caixa_id/consumo', function(req, res) {
    CaixaDeAgua.findById(req.params.caixa_id, function(error, caixa) {
             if (error){ 
              res.status(400).json({err: error});
            };
            consumos = caixa.historicoConsumo;
            if (req.query.ano != null) {
                consumos = EstatisticaAPI.data.filtrarPorAno(consumos, req.query.ano);
            };
            if (req.query.mes != null) {
                consumos = EstatisticaAPI.data.filtrarPorMes(consumos, req.query.mes);
            };
            if (req.query.dia != null) {
                consumos = EstatisticaAPI.data.filtrarPorDia(consumos, req.query.dia);
            };
            if (req.query.inicio != null && req.query.fim != null) {
                consumos = EstatisticaAPI.data.filtrarRange(consumos, req.query.inicio, req.query.fim);
            };

            f(req.query.granularidade != null){
                consumos = EdificioAPI.granularidade(consumos,req.query.granularidade);
            }else{
                consumos = EdfificioAPI.granularidade(consumos,'day');
            };


            consumosFiltrados = [];
            consumos.forEach(function(cd) {
                var newConsumo = {
                    x: cd.data.getTime(),
                    y: cd.consumo
                };
                consumosFiltrados.push(newConsumo);
            });
            consumosFiltrados.sort(function(a, b) {
              return a.x - b.x;
             });
            res.json(consumosFiltrados);

        }

    )
});

//CREATE
router.post('/caixa/:caixa_id/consumo/new', function(req, res) {
    if (req.body.data == null) {
              res.status(400).json({err: error});

    };
    CaixaDeAgua.findById(req.params.caixa_id, function(error, caixa) {
        if (error) res.send(caixa);
        data = new Date(req.body.data);
        novoConsumo = {
            data: data.setTime(data.getTime() + data.getTimezoneOffset() * 60 * 1000),
            consumo: req.body.consumo
        };
        caixa.historicoConsumo.push(novoConsumo);
        caixa.save(function(error) {
            if (error) {
                res.send(error);
            } else {
                res.json(caixa.historicoConsumo);
            }
        });
    });
});


// Update (Consumo)
router.put('/caixa/:caixa_id/consumo/:consumo_id', function(req, res) {
    CaixaDeAgua.findById(req.params.caixa_id, function(err, caixa) {
        if (err) {
            res.status(400).json({error: err});
        } else {
            consumosAtualizado = [];
            caixa.historicoConsumo.forEach(function(consumo) {
                if (consumo._id == req.params.consumo_id) {
                    data = new Date(req.body.data);
                    if (req.body.data) consumo.data       = data.setTime(data.getTime() + data.getTimezoneOffset() * 60 *1000);
                    if (req.body.consumo) consumo.consumo = req.body.consumo;
                }
                consumosAtualizado.push(consumo);
            });
            caixa.historicoConsumo = consumosAtualizado;
            caixa.save(function(err) {
                if (err) {
                    res.status(400).json({error: err});
                } else {
                    res.status(200).json({message: 'Consumo atualizado.'});
                }
            });
        }
    });
});

// Delete (Consumo)
router.delete('/caixa/:caixa_id/consumo/:consumo_id', function(req, res) {
    CaixaDeAgua.findById(req.params.caixa_id, function(err, caixa) {
        if (err) {
            res.status(400).json({error: err});
        } else {
            consumosFiltrados = [];
            caixa.historicoConsumo.forEach(function(consumo) {
                if (consumo._id != req.params.consumo_id) {
                    consumosFiltrados.push(consumo);
                }
            });

            caixa.historicoConsumo = consumosFiltrados;
            caixa.save(function(err) {
                if (err) {
                    res.status(400).json({error: err});
                } else {
                    res.status(200).json({message: 'Consumo removido.'});
                }
            });
        }
    });
});


//GEOLOCALIZAÇÃO
// UPDATE
router.post('/caixa/:caixa_id/geolocalizacao', function(req, res) {
    CaixaDeAgua.findById(req.params.caixa_id, function(error, caixa) {
        if (error) res.send(caixa);
        caixa.geolocalizacao.latitude = req.body.latitude;
        caixa.geolocalizacao.longitude = req.body.longitude;
        caixa.save(function(error) {
            if (error){ 
              res.status(400).json({err: error});
            }
              else{
            res.json(caixa);
          }
        });
    });
});



// create, update, show, delete



module.exports = router;