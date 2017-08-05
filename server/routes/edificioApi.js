var express = require('express');
var router = express.Router();
var passport = require('passport');
var EstatisticaAPI = require('./estatisticaApi.js');
var User = require('../models/user.js');
var Edificio = require('../models/edificio.js');

///change the geolocalization of a building
router.post('/edificio/:edificio_id/geolocalizacao', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(error, edificio) {
        if (error) res.send(edificio);
        edificio.geolocalizacao.latitude = req.body.latitude;
        edificio.geolocalizacao.longitude = req.body.longitude;
        edificio.save(function(error) {
            if (error){ 
              res.status(400).json({err: error});
            }
              else{
            res.json(edificio);
          }
        });
    });
});

/// Obter os consumos de um edificio
router.get('/edificio/:edificio_id/consumo', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(error, edificio) {
             if (error){ 
              res.status(400).json({err: error});
            };
            consumos = edificio.historicoConsumo;
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
            consumosFiltrados = [];
            consumos.forEach(function(cd) {
                var newConsumo = {
                    x: cd.data,
                    y: cd.consumo
                };
                consumosFiltrados.push(newConsumo);
            });
            res.json(consumosFiltrados);

        }

    )
});

router.post('/edificio/:edificio_id/consumo/new', function(req, res) {
    if (req.body.data == null) {
              res.status(400).json({err: error});

    };
    Edificio.findById(req.params.edificio_id, function(error, edificio) {
        if (error) res.send(edificio);
        data = new Date(req.body.data);
        novoConsumo = {
            data: data.setTime(data.getTime() + data.getTimezoneOffset() * 60 * 1000),
            consumo: req.body.consumo
        };
        edificio.historicoConsumo.push(novoConsumo);
        edificio.save(function(error) {
            if (error) {
                res.send(error);
            } else {
                res.json(edificio.historicoConsumo);
            }
        });
    });
});

router.get('/edificio/:edificio_id/vazamentos', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(error, edificio) {
         if (error){ 
              res.status(400).json({err: error});
            }
              else{
            res.json(edificio);
          };
        // Filtrar
        //Checar com eles, se tiver dois vazamentos no mesmo dia. o que fazer? Juntar?
        vazamentosFiltrados = edificio.vazamentos;
        res.json(vazamentosFiltrados);

    })
});

router.delete('/edificio/:edificio_id/vazamentos/:vazamento_id', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(error, edificio) {
         if (error){ 
              res.status(400).json({err: error});
          };
        vazamentosFiltrados = [];
        edificio.vazamentos.forEach(function(vazamento) {
            if (vazamento._id != req.params.vazamento_id) {
                vazamentosFiltrados.push(vazamento);
            }
        })
        edificio.vazamentos = vazamentosFiltrados;
        edificio.save(function(error) {
            if (error){ 
              res.status(400).json({err: error});
            } else {
                res.json(edificio.vazamentos);
            }

        })
    });


});


router.post('/edificio/:edificio_id/vazamentos/new', function(req, res) {
    if (req.body.data == null) {
        res.status(400);
        res.send("Body is empty");
        return;
    };
    Edificio.findById(req.params.edificio_id, function(error, edificio) {

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
        edificio.vazamentos.push(novoVazamento);
        edificio.save(function(error) {
            if (error) {
                res.status(422);
                res.send(error.message);
                return;
            } else {
                res.json(edificio.vazamentos);
            }
        });
    });
});

router.post('/edificio', function(req, res) {
    var edificio = new Edificio();
    edificio.nome = req.body.nome;
    edificio.descricao = req.body.descricao;
    edificio.atividade = req.body.atividade;
    edificio.caracteristicasFisicas = req.body.caracteristicasFisicas;
    edificio.geolocalizacao = req.body.geolocalizacao;
    edificio.historicoConsumo = req.body.historicoConsumo;
    edificio.mediaEsperada = req.body.mediaEsperada;
    edificio.vazamentos = req.body.vazamentos;
    if (req.body.historicoConsumo == null) {
        edificio.historicoConsumo = [];
    };
    if (req.body.vazamentos == null) {
        edificio.vazamentos = [];
    }
    edificio.save(function(error) {
        if (error){ 
          res.status(400);
          res.send(error.message);}
        else res.json(edificio);
    });

});

var filtrarPorSetor = function(setor, edificios) {
    edificiosFiltrados = [];
    edificios.forEach(function(edificio) {
        if (edificio.caracteristicasFisicas.localizacao.setor == setor) {
            edificiosFiltrados.push(edificio);
        }
    });
    return edificiosFiltrados;
}

var emAlerta = function(edificios, margem) {
    edificiosFiltrados = [];
    edificios.forEach(function(ed) {
        total = 0.0;
        ed.historicoConsumo.forEach(function(cd) {
            if (cd.data.toDateString() == (new Date()).toDateString()) {
                total += cd.consumo;
            }
        });
        if (margem == 0.2) {
            if (total >= ed.mediaEsperada + margem * ed.mediaEsperada && (total < (ed.mediaEsperada + 0.3 * ed.mediaEsperada))) {
                edificiosFiltrados.push(ed);
            };
        } else if (total >= ed.mediaEsperada + margem * ed.mediaEsperada) {
            edificiosFiltrados.push(ed);
        }
    });
    return edificiosFiltrados;
}

var FindEdificio = function(edificio_id, res) {
    var edificiores;
    Edificio.find(function(err, edificio) {
        if (err) {
            res.status(400);
            res.send(err.message);
            return null;
        };
        edificiores = edificio;


    });
    return edificiores;
};
router.get('/edificio', function(req, res) {
    Edificio.find(function(err, edificios) {
        if (req.query.setor != null) {
            edificios = filtrarPorSetor(req.query.setor, edificios);
        }
        if (req.query.nivelAlerta != null) {
            nivelAlerta = req.query.nivelAlerta;
            if (nivelAlerta == "0") {
                margem = 0.2;
            } else if (nivelAlerta == "1") {
                margem = 0.3;
            };
            var result = emAlerta(edificios, margem);
            res.send(result);
            return;
        }
        if (req.query.withAlerta) {
            if (req.query.withAlerta == 'true') {
                var result0 = emAlerta(edificios, 0.2);
                var result1 = emAlerta(edificios, 0.3);
                res.json({
                    todos: edificios,
                    alerta0: result0,
                    alerta1: result1
                });
                return;
            }
        }
        if (err) {
            res.send(err)
        } else {
            res.json(edificios);
        }
    });
});



router.get('/edificio/:edificio_id', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(error, edificio) {
        if (error) res.send(edificio);
        res.json(edificio);
    });
});

router.post('/edificio/:edificio_id', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(error, edificio) {
        if (error) res.send(edificio);
        edificio.nome = req.body.nome;
        edificio.descricao = req.body.descricao;
        edificio.atividade = req.body.atividade;
        edificio.geolocalizacao = req.body.geolocalizacao;
        edificio.caracteristicasFisicas = req.body.caracteristicasFisicas;
        edificio.historicoConsumo = req.body.historicoConsumo; // Pessoalmente eu acho melhor que essa linha não exista;
        edificio.vazamentos = req.body.vazamentos;
        edificio.save(function(error) {
            if (error) res.send(error);
            res.json(edificio);
        });
    });
});

router.route('/edificio/:edificio_id')
    .delete(function(req, res) {
        Edificio.remove({
            _id: req.params.edificio_id
        }, function(error) {
            if (error) res.send(error);
            res.json({
                message: "Prédio removido!"
            });
        });
    });


module.exports = router;