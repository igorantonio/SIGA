var express = require('express');
var router = express.Router();
var passport = require('passport');
var EstatisticaAPI = require('./estatisticaApi.js');
var EdificioAPI = require('./edificioApi.js');
var User = require('../models/user.js');
var CaixaDeAgua = require('../models/caixaDeAgua.js');


/**
 * @api {post} /caixa/ Criação de caixa de agua
 * @apiName createCaixa
 * @apiGroup Caixa
 * @apiDescription Todos os parâmetros devem estar encapsulados em um json.
 * @apiParam {String} nome     Nome para a caixa de agua (Obrigatório).
 * @apiParam {String {10..}} descricao="Nenhuma descrição informada"     Descrição para a caixa de agua (Obrigatório).
 * @apiParam {json} caracteristicasFisicas     Caracteristicas fisicas da caixa de agua.
 * @apiParam {json} caracteristicasFisicas.localizacao     Localização da caixa d'agua.
 * @apiParam {String} caracteristicasFisicas.localizacao.setor     Setor onde a caixa d'água está localizada.
 * @apiParam {String} caracteristicasFisicas.localizacao.bloco     Bloco onde a caixa d'água está localizada.
 * @apiParam {Number} caracteristicasFisicas.area     Área ocupada pela caixa d'agua.
 * @apiParam {Number} caracteristicasFisicas.n_pavimentos     Número de pavimentos da caixa d'agua.
 * @apiParam {Number} caracteristicasFisicas.ocupacaoMedia     Ocupação Média da caixa d'agua.
 * @apiParam {Number} caracteristicasFisicas.volumeReservatorio     Capacidade da caixa d'agua.
 * @apiParam {Number} mediaEsperada     Média de consumo esperada (No dia).
 * @apiParam {json[]} [historicoConsumo]     Histórico de consumo da caixa. Exemplo de item:
 * @apiParam {json} [historicoConsumo.0]     Exemplo de Item da lista. (Referente ao registro de consumo da caixa). 
 * @apiParam {Date} historicoConsumo.0.data     Data do registro.
 * @apiParam {Number} historicoConsumo.0.consumo     Volume consumido registrado.

 */

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


/**
 * @api {get} /caixa Index
 * @apiName IndexCaixa
 * @apiGroup Caixa
 * @apiParam {String} nivelAlerta (Query) Filtrar o resultado obtido por estado de alerta, nível 0 ou 1.
 * @apiParam {String} withAlerta (Query) Filtrar o resultado para edificios com algum dos níveis de alerta. {'true'}
 * @apiSuccess {json} caixas Todas as caixas d'agua obtidas.
 *
 */

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
/**
 * @api {get} /caixa/:caixa_id Obter informações de um caixa
 * @apiName ShowCaixa
 * @apiGroup Caixa
 * @apiParam {String} caixa_id Identificador para a caixa.
 * @apiSuccess {json} edificio informações sobre o edificio.
 *
 */
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

/**
 * @api {post} /caixa/:caixa_id Atualizar informações de caixa de agua
 * @apiName updateCaixa
 * @apiGroup Caixa
 * @apiDescription Todos os parâmetros devem estar encapsulados em um json.
 * @apiParam {String} caixa_id Identificador da caixa.
 * @apiParam {String} nome     Nome para a caixa de agua (Obrigatório).
 * @apiParam {String {10..}} descricao="Nenhuma descrição informada"     Descrição para a caixa de agua (Obrigatório).
 * @apiParam {json} caracteristicasFisicas     Caracteristicas fisicas da caixa de agua.
 * @apiParam {json} caracteristicasFisicas.localizacao     Localização da caixa d'agua.
 * @apiParam {String} caracteristicasFisicas.localizacao.setor     Setor onde a caixa d'água está localizada.
 * @apiParam {String} caracteristicasFisicas.localizacao.bloco     Bloco onde a caixa d'água está localizada.
 * @apiParam {Number} caracteristicasFisicas.area     Área ocupada pela caixa d'agua.
 * @apiParam {Number} caracteristicasFisicas.n_pavimentos     Número de pavimentos da caixa d'agua.
 * @apiParam {Number} caracteristicasFisicas.ocupacaoMedia     Ocupação Média da caixa d'agua.
 * @apiParam {Number} caracteristicasFisicas.volumeReservatorio     Capacidade da caixa d'agua.
 * @apiParam {Number} mediaEsperada     Média de consumo esperada (No dia).
 * @apiParam {json[]} [historicoConsumo]     Histórico de consumo da caixa. 
 * @apiParam {json[]} [vazamentos]     Histórico de vazamentos da caixa. 
 */
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

/**
 * @api {delete} /caixa/:caixa_id Remover um edificio
 * @apiName deleteCaixa
 * @apiGroup Caixa
 * @apiParam {Number} caixa_id Identificador da caixa.
 * @apiSuccess {json} message Mensagem informando que a caixa foi removida.
 *
 */
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



/**
 * @api {get} /caixa/:caixa_id/vazamentos Obter vazamentos
 * @apiName getVazamentos
 * @apiGroup Caixa
 * @apiParam {String} caixa_id     Identificador da caixa de agua.
 * @apiSuccess {json} vazamentos Vazamentos da caixa.
 */

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



/**
 * @api {post} /caixa/:caixa_id/vazamentos/new Adicionar vazamento
 * @apiName createVazamentos
 * @apiGroup Caixa
 * @apiParam {String} caixa_id     Identificador da caixa de agua.
 * @apiParam {Date} data     Data do vazamento.
 * @apiParam {Date} volume     Volume do vazamento. 
 * @apiSuccess {json} vazamentos Vazamentos da caixa (incluindo novo vazamento).
 */
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
            data: data.setTime(data.getTime()),
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


/**
 * @api {post} /caixa/:caixa_id/vazamentos/:vazamento_id  Atualizar informações de um vazamento
 * @apiName updateVazamento
 * @apiGroup Caixa
 * @apiParam {String} caixa_id     Identificador da caixa de agua.
 * @apiParam {String} vazamento_id     Identificador do vazamento a ser removido.
 * @apiParam {Date} data     Data do vazamento.
 * @apiParam {Date} volume     Volume do vazamento. 
 * @apiSuccess {json} resposta 
 * @apiSuccess {json} resposta.message Mensagem informando o sucesso da alteração: "Vazamento atualizado".
 */
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
                    if (req.body.data) vazamento.data       = data.setTime(data.getTime() );
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



/**
 * @api {delete} /caixa/:caixa_id/vazamentos/:vazamento_id  Remover um vazamento
 * @apiName deleteVazamento
 * @apiGroup Caixa
 * @apiParam {String} caixa_id     Identificador da caixa de agua.
 * @apiParam {String} vazamento_id     Identificador do vazamento a ser removido.
 * @apiSuccess {json} vazamentos Vazamentos da caixa (após a exclusão).
 */
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

/**
 * @api {get} /caixa/:caixa_id/consumo  Obter consumos
 * @apiName getConsumo
 * @apiGroup Caixa
 * @apiParam {String} caixa_id     Identificador da caixa de agua.
 * @apiParam {Number} [ano]     Filtrar para obter apenas consumos de um determinado ano.
 * @apiParam {Number} [mes]     Filtrar para obter apenas consumos de um determinado mês.
 * @apiParam {Number} [dia]     Filtrar para obter apenas consumos de um determinado dia.
 * @apiParam {String} [inicio]     Filtrar para obter apenas consumos a partir de uma certa data (inicio). A String deve seguir o padrão de representação de data javascript.
 * @apiParam {String} [fim]     Filtrar para obter apenas consumos até uma certa data (fim). A String deve seguir o padrão de representação de data javascript.
 * @apiParam {String} [granularidade='day']     Definir agrupamento dos consumos. valores permitidos: {'anual','mensal','diario',detalhado}.
 * @apiSuccess {json} consumos Consumos da caixa (respeitando as restrições de filtro e agrupamento).
 */
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

            if(req.query.granularidade != null){
                consumos = EdificioAPI.data.granularidade(consumos,req.query.granularidade);
            }else{
                consumos = EdificioAPI.data.granularidade(consumos,'day');
            };

            consumosFiltrados = [];
            for (key in consumos){
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

        }

    )
});


//CREATE
/**
**
 * @api {post} /caixa/:caixa_id/consumo/new  Adicionar consumo
 * @apiName createConsumo
 * @apiGroup Caixa
 * @apiParam {String} caixa_id     Identificador da caixa de agua.
 * @apiParam {Date} data     Data do registro. (Caso o consumo seja referente a varios dias, este é o ultimo dia).
 * @apiParam {Number} consumo     Volume consumido registrado.
 * @apiParam {Number} [qDias=1]     Quantidade de dias que o consumo é referente. 
 * @apiSuccess {json} consumos Consumos da caixa (após a adição do novo consumo).
 */
router.post('/caixa/:caixa_id/consumo/new', function(req, res) {
    if (req.body.data == null) {
              res.status(400).json({err: error});

    };
    CaixaDeAgua.findById(req.params.caixa_id, function(error, caixa) {
        if (error) res.send(caixa);
        data = new Date(req.body.data);
        novoConsumo = {
            data: data.setTime(data.getTime()),
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


/**
**
 * @api {put} /caixa/:caixa_id/consumo/:consumo_id Atualizar informações sobre um consumo
 * @apiName updateConsumo
 * @apiGroup Caixa
 * @apiParam {String} caixa_id     Identificador da caixa de agua.
 * @apiParam {String} consumo_id     Identificador do consumo.
 * @apiParam {Date} data     Data do registro.
 * @apiParam {Number} consumo     Volume consumido registrado.
 * @apiSuccess {json} consumos Consumos da caixa (após a atualização do consumo).
 */
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
                    if (req.body.data) consumo.data       = data.setTime(data.getTime());
                    if (req.body.consumo) consumo.consumo = req.body.consumo;
                }
                consumosAtualizado.push(consumo);
            });
            caixa.historicoConsumo = consumosAtualizado;
            caixa.save(function(err) {
                if (err) {
                    res.status(400).json({error: err});
                } else {
                    res.status(200).json(consumosAtualizado);
                }
            });
        }
    });
});


/**
**
 * @api {delete} /caixa/:caixa_id/consumo/:consumo_id Remover um consumo
 * @apiName deleteConsumo
 * @apiGroup Caixa
 * @apiParam {String} caixa_id     Identificador da caixa de agua.
 * @apiParam {String} consumo_id     Identificador do consumo.
 * @apiSuccess {json} consumos Consumos da caixa (após a exclusão do consumo).
 */

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
                    res.status(200).json(consumosFiltrados);
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