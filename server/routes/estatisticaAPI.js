var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.js');
var Edificio = require('../models/edificio.js');


// Estatisticas referentes a edificios
router.get('/estatistica/edificio/:edificio_id', function(req,res){
  Edificio.findById(req.params.edificio_id, function(error, edificio){
    if(error) res.send(edificio);
    sum = 0.0;
    max = -1.0;
    min =  9999999;
    /*edificio.consumoDiario.forEach(function(cd){
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
    res.json({media_dia: sum/total, total: sum, maximo:max, dia_maximo:maxDia, minimo: min, dia_minimo: minDia});*/
    res.json(calculaEstatisticas(edificio.consumoDiario));
  });
});

var calculaEstatisticas = function(consumos){
  var sum = 0.0;
  var max = -1;
  var min = 9999999999;
  var acum = 0;
  consumos.forEach(function(cd){
    var consumo = cd.consumo;
    acum += consumo;
    sum += consumo;
    if (consumo> max){
      max = consumo;
      maxDia = cd.dia;
    };
    if (min > consumo){
      min = consumo;
      minDia = cd.dia;
    };
  });
  total = consumos.length;
  return {total: acum, media: sum/total, total: sum, maximo:max, dia_max:maxDia, minimo: min, dia_minimo: minDia};
};

//Como ainda não tem nenhum com nada, ele ta filtrando pelo consumo. Basta arrumar e trocar o elem.consumo para elem.date.YEAR(?)
router.get('/estatistica/edificio/:edificio_id/ano/:ano', function(req,res){
  Edificio.findById(req.params.edificio_id,  function(error, edificio){
    if(error) res.send(edificio);
    var consumos = edificio.consumoDiario.filter(function(elem, i, array){
      return elem.dia.getFullYear() == req.params.ano;
    }) ;
    res.json(calculaEstatisticas(consumos));
    
    }
    );

});

router.get('/estatistica/edificio/:edificio_id/mes/:mes', function(req,res){
  Edificio.findById(req.params.edificio_id,  function(error, edificio){
    if(error) res.send(edificio);
    var consumos = edificio.consumoDiario.filter(function(elem, i, array){
      return elem.dia.getMonth() == req.params.mes;
    }) ;
    res.json(calculaEstatisticas(consumos));
    }
    );

});


router.get('/estatistica/setor/:setor', function(req,res){
  Edificio.findBySetor(req.params.setor,  function(error, edificio){
    if(error) res.send(edificio);
        res.json(calculaEstatisticas(edificio.consumoDiario));
    }
    );

});






module.exports = router;