var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.js');
var Edificio = require('../models/edificio.js');

router.get('/estatistica/edificio/:edificio_id', function(req,res){
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

//Como ainda não tem nenhum com nada, ele ta filtrando pelo consumo. Basta arrumar e trocar o elem.consumo para elem.date.YEAR(?)
router.get('/estatistica/edificio/:edificio_id/ano/:ano', function(req,res){
  Edificio.findById(req.params.edificio_id,  function(error, edificio){
    if(error) res.send(edificio);
    var consumos = edificio.consumoDiario.filter(function(elem, i, array){
      return elem.consumo>= req.params.ano;
    }) ;
    
        res.json({edificios: consumos});

    }
    );

});




module.exports = router;