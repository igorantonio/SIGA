var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.js');
var Edificio = require('../models/edificio.js');

///Building's API
router.post('/edificio/:edificio_id/geolocalizacao', function(req,res){
  Edificio.findById(req.params.edificio_id, function(error,edificio){
    if(error) res.send(edificio);
    edificio.geolocalizacao.latitude = req.body.latitude;
    edificio.geolocalizacao.longitude = req.body.longitude;
    edificio.save(function(error){
      if(error) res.send(error);
      res.json(edificio);
    });
  });
});

//Esse codigo leva em consideração apenas uma atualização de consumo por dia;
router.get('/edificio/:edificio_id/estatisticas', function(req,res){
  Edificio.findById(req.params.edificio_id, function(error, edificio){
    if(error) res.send(edificio);
    sum = 0.0;
    max = -1.0;
    min =  9999999;
    edificio.consumoDiario.forEach(function(cd){
      consumo = cd.consumo;
      sum += consumo;
      if (consumo > max){
        max = consumo;
        maxDia = cd.dia
      };
      if (min > consumo){
        min = consumo;
        minDia = cd.dia
      };
    });
    total = edificio.consumoDiario.length;
    res.json({media_dia: sum/total, total: sum, maximo:max, dia_maximo:maxDia, minimo: min, dia_minimo: minDia});
  });
});

router.post('/edificio/:edificio_id/consumoDiario/new', function(req,res){
  Edificio.findById(req.params.edificio_id, function(error,edificio){
    if(error) res.send(edificio);
    novoConsumo = {dia: req.body.dia, consumo: req.body.consumo}
    edificio.consumoDiario.push(novoConsumo);
    edificio.save(function(error){
      if(error) res.send(error);
      res.json(edificio.consumoDiario);
    });
  });
});


router.post('/edificio', function(req,res){
var edificio = new Edificio();
  edificio.nome = req.body.nome;
  edificio.descricao = req.body.descricao;
  edificio.atividade = req.body.atividade;
  edificio.caracteristicasFisicas = req.body.caracteristicasFisicas;
  edificio.geolocalizacao = req.body.geolocalizacao;
  edificio.consumoDiario = req.body.consumoDiario;
  edificio.save(function(error){
    if(error) res.send(error);
    res.json(edificio);
  });

});
router.get('/edificio', function(req,res){
  Edificio.find(function(err, edificios){
    if (err) res.send(err);
    res.json(edificios);
  });
});

router.get('/edificio/:edificio_id', function(req,res){
  Edificio.findById(req.params.edificio_id, function(error,edificio){
    if(error) res.send(edificio);
    res.json(edificio);
  });
});

router.post('/edificio/:edificio_id', function(req,res){
  Edificio.findById(req.params.edificio_id, function(error,edificio){
    if(error) res.send(edificio);
    edificio.nome = req.body.nome;
    edificio.descricao = req.body.descricao;
    edificio.atividade = req.body.atividade;
    edificio.geolocalizacao = req.body.geolocalizacao;
    edificio.caracteristicasFisicas = req.body.caracteristicasFisicas;
    edificio.consumoDiario = req.body.consumoDiario; // Pessoalmente eu acho melhor que essa linha não exista;
    edificio.save(function(error){
    	if(error) res.send(error);
    	res.json(edificio);
    });
  });
});

router.route('/edificio/:edificio_id')
  .delete(function(req, res){
    Edificio.remove({
      _id: req.params.edificio_id
    }, function(error){
      if(error) res.send(error);
      res.json({message: "Prédio removido!"});
    });
  });


module.exports = router;