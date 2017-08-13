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

/// Show/Index (Consumo)
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

// Create (Consumo)
router.post('/edificio/:edificio_id/consumo/new', function(req, res) {
    if (req.body.data == null) {
              res.status(400).json({err: 'Campo de data não informado.'});

    };
    Edificio.findById(req.params.edificio_id, function(error, edificio) {
        if (error) res.send(edificio);
        data = new Date(req.body.data);
        novoConsumo = {
            data: data.setTime(data.getTime() + data.getTimezoneOffset() * 60 * 1000),
            consumo: req.body.consumo
        };
        edificio.historicoConsumo.push(novoConsumo);
        edificio.save(function(err) {
            if (err) {
                res.status(400).json({error: err});
            } else {
                res.status(200).json(edificio.historicoConsumo);
            }
        });
    });
});

// Update (Consumo)
router.put('/edificio/:edificio_id/consumo/:consumo_id', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(err, edificio) {
        if (err) {
            res.status(400).json({error: err});
        } else {
            consumosAtualizado = [];
            edificio.historicoConsumo.forEach(function(consumo) {
                if (consumo._id == req.params.consumo_id) {
                    data = new Date(req.body.data);
                    if (req.body.data) consumo.data       = data.setTime(data.getTime() + data.getTimezoneOffset() * 60 *1000);
                    if (req.body.consumo) consumo.consumo = req.body.consumo;
                }
                consumosAtualizado.push(consumo);
            });
            edificio.historicoConsumo = consumosAtualizado;
            edificio.save(function(err) {
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
router.delete('/edificio/:edificio_id/consumo/:consumo_id', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(err, edificio) {
        if (err) {
            res.status(400).json({error: err});
        } else {
            consumosFiltrados = [];
            edificio.historicoConsumo.forEach(function(consumo) {
                if (consumo._id != req.params.consumo_id) {
                    consumosFiltrados.push(consumo);
                }
            });

            edificio.historicoConsumo = consumosFiltrados;
            edificio.save(function(err) {
                if (err) {
                    res.status(400).json({error: err});
                } else {
                    res.status(200).json({message: 'Consumo removido.'});
                }
            });
        }
    });
});

// Index (Vazamento)
router.get('/edificio/:edificio_id/vazamentos', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(err, edificio) {
        if (err){ 
            res.status(400).json({error: err});
        } else {
            res.json(edificio.vazamentos);
        };
    });
});

// Show (Vazamento)
router.get('/edificio/:edificio_id/vazamentos/:vazamento_id', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(err, edificio) {
        if (err) {
            res.status(400).json({error: err});
        } else {
            vazamentosFiltrados = []
            edificio.vazamentos.forEach(function(vazamento) {
                if (vazamento._id == req.params.vazamento_id) {
                    vazamentosFiltrados.push(vazamento);
                    return;
                }
            });
            res.status(200).json(vazamentosFiltrados);
        }
    });
});

// Create (Vazamento)
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

// Delete (Vazamento)
router.delete('/edificio/:edificio_id/vazamentos/:vazamento_id', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(err, edificio) {
         if (err){ 
              res.status(400).json({error: err});
          };
        vazamentosFiltrados = [];
        edificio.vazamentos.forEach(function(vazamento) {
            if (vazamento._id != req.params.vazamento_id) {
                vazamentosFiltrados.push(vazamento);
            }
        });
        edificio.vazamentos = vazamentosFiltrados;
        edificio.save(function(err) {
            if (err){ 
              res.status(400).json({error: err});
            } else {
                res.json(edificio.vazamentos);
            }

        });
    });
});

// Index    (Alerta)
router.get('/edificio/:edificio_id/alertas', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(err, edificios) {
        if (err) {
            res.status(400).json({error: err});
        } else {
            res.status(200).json(edificios.alertas);
        }
    });
});

// Show     (Alerta)
router.get('/edificio/:edificio_id/alertas/:alerta_id', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(err, edificio) {
        if (err) {
            res.status(400).json({error: err});
        } else {
            alertasFiltrados = [];
            edificio.alertas.forEach(function(alerta) {
                if (alerta._id == req.params.alerta_id) {
                    alertasFiltrados.push(alerta);
                    return;
                }
            });
            res.status(200).json(alertasFiltrados);
        }
    });
});

// Create   (Alerta)
router.post('/edificio/:edificio_id/alertas/new', function(req, res) {
    if (req.body.data == null) {
        res.status(400).send("Body is empty");
        return;
    }

    Edificio.findById(req.params.edificio_id, function(err, edificio) {
        if (err) {
            res.status(400).json({error: err});
            return
        };

        data = new Date(req.body.data);
        novoAlerta = {
            data: data.setTime(data.getTime() + data.getTimezoneOffset() * 60 * 1000),
            checked: req.body.checked
        };

        edificio.alertas.push(novoAlerta);
        edificio.save(function(err) {
            if (err) {
                res.status(422).json({error: err.message});
                return;
            } else {
                res.json(edificio.alertas);
            }
        });
    });
});

// Update   (Alerta)
router.put('/edificio/:edificio_id/alertas/:alerta_id', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(err, edificio) {
        if (err) {
            res.status(400).json({error: err});
        } else {
            alertasFiltrados = [];
            edificio.alertas.forEach(function(alerta) {
                if (alerta._id == req.params.alerta_id) {
                    if (req.body.data) alerta.data       = req.body.data;
                    if (req.body.checked) alerta.checked = req.body.checked;
                }
                alertasFiltrados.push(alerta);
            });
            edificio.alertas = alertasFiltrados;
            edificio.save(function(err) {
                if (err) {
                    res.status(400).json({ error: err});
                } else {
                    res.status(200).json({ message: 'Alerta atualizado.'});
                }
            });
        }
    });
});

// Delete   (Alerta)
router.delete('/edificio/:edificio_id/alertas/:alerta_id', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(err, edificio) {
        if (err) {
            res.status(400).json({error: err});
        } else {
            alertasFiltrados = [];
            edificio.alertas.forEach(function(alerta) {
                if (alerta._id != req.params.alerta_id) {
                    alertasFiltrados.push(alerta);
                }
            });
            edificio.alertas = alertasFiltrados;
            edificio.save(function(err) {
                if (err) {
                    res.status(400).json({error: err});
                } else {
                    res.status(200).json({message: 'Alerta removido.'});
                }
            });
        }
    });
});

// Index (Edificio)
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

// Show (Edificio)
router.get('/edificio/:edificio_id', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(error, edificio) {
        if (error) res.send(edificio);
        res.json(edificio);
    });
});

// Create (Edificio)
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

// Uṕdate (Edificio)
router.put('/edificio/:edificio_id', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(err, edificio) {
        if (req.body.nome) edificio.nome            = req.body.nome;
        if (req.body.descricao) edificio.descricao  = req.body.descricao;
        if (req.body.atividade) edificio.atividade  = req.body.atividade;
        if (req.body.caracteristicasFisicas) edificio.caracteristicasFisicas = req.body.caracteristicasFisicas;
        if (req.body.geolocalizacao) edificio.geolocalizacao        = req.body.geolocalizacao;
        if (req.body.historicoConsumo) edificio.historicoConsumo    = req.body.historicoConsumo;
        if (req.body.mediaEsperada) edificio.mediaEsperada          = req.body.mediaEsperada;
        if (req.body.vazamentos) edificio.vazamentos                = req.body.vazamentos;
        edificio.save(function(err) {
            if (err) {
                res.status(400).json({error: err});
            } else {
                res.status(200).json({message: 'Edificio atualizado.'});
            }
        });
    });
});

//Delete (Edificio)
router.delete('/edificio/:edificio_id', function(req, res) {
    Edificio.remove({ _id: req.params.edificio_id }, function(error) {
        if (error) res.send(error);
        res.json({ message: "Prédio removido!" });
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

module.exports = router;