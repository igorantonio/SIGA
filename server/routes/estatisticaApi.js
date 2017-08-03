var express = require('express');
var router = express.Router();
var passport = require('passport');
var moment = require('moment');

var User = require('../models/user.js');
var Edificio = require('../models/edificio.js');

// Estatisticas referentes a edificios
router.get('/estatistica/edificio/:edificio_id', function(req,res){
  Edificio.findById(req.params.edificio_id, function(error, edificio){
    if(error) res.send(edificio);
    sum = 0.0;
    max = -1.0;
    min =  9999999;
    
    var consumos = edificio.consumoDiario;
    if (req.query.ano != null){
      consumos = filtrarPorAno(consumos, req.query.ano);
    };
    if (req.query.mes != null){
      if  (!verificarMes(req.query.mes)){
        res.status(401);
        return;
      }
      consumos = filtrarPorMes(consumos, req.query.mes);
    };
    if (req.query.dia != null){
      consumos = filtrarPorDia(consumos, req.query.dia);
    };
    if (req.query.inicio != null && req.query.fim != null){
      consumos = filtrarRange(consumos, req.query.inicio, req.query.fim);
    };
    res.json(calculaEstatisticas(consumos));
  });
});

var verificarMes = function(mes){
  return mes >=1 && mes <= 12;
};

var verifica
var calculaEstatisticas = function(consumos){
  var sum = 0.0;
  var max = -1;
  var min = 9999999999;
  var acum = 0;
  var maxDia;
  var minDia;
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

var filtrarPorAno = function(consumos, ano){
  var consumosFiltrados = [];
  consumos.forEach(function(cd){
    if (cd.dia.getFullYear() == ano ){
        consumosFiltrados.push(cd);
    };
  });
  return consumosFiltrados;
};

var filtrarPorMes = function(consumos, mes){
  var consumosFiltrados = [];
  consumos.forEach(function(cd){
    if (cd.dia.getMonth() == mes-1){
      consumosFiltrados.push(cd);
    };
  });
  return consumosFiltrados;
};

var filtrarPorDia = function(consumos, dia){
  var consumosFiltrados =[];
  consumos.forEach(function(cd){
    if (cd.dia.getDate() == dia){
      consumosFiltrados.push(cd);
    };
  });
  return consumosFiltrados;
};

var filtrarRange = function(consumos, startDate, endDate) {
  var start = 0;
  var end = consumos.length;
  var consumosFiltrados = [];
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  consumos.forEach(function(cd){
if (cd.dia.getTime() >= startDate.getTime() && cd.dia.getTime() <= endDate.getTime()){
  consumosFiltrados.push(cd);
};
  });
  return consumosFiltrados;

};


router.get('/estatistica/setor/:setor', function(req,res){
  Edificio.findBySetor(req.params.setor,  function(error, edificios){
    if(error) res.send(edificios);
    var consumos = [];
    for (i in edificios){
      consumos = consumos.concat(edificios[i].consumoDiario);
    };
    if (req.query.ano != null){
      consumos = filtrarPorAno(consumos, req.query.ano);
    };
    if (req.query.mes != null){
      consumos = filtrarPorMes(consumos, req.query.mes);
    };
    if (req.query.dia != null){
      consumos = filtrarPorDia(consumos, req.query.dia);
    };
    if (req.query.inicio != null && req.query.fim != null){
      consumos = filtrarRange(consumos, inicio, fim);
    };
        res.json(calculaEstatisticas(consumos));
    });

});


module.exports.data = {
  router: router,
  filtrarRange: function(consumos, startDate, endDate) {
    return filtrarRange(consumos,startDate,endDate);
    },
  filtrarPorDia: function(consumos, dia){
    return filtrarPorDia(consumos,dia);
  },
  filtrarPorMes: function(consumos, mes){
    return filtrarPorMes(consumos, mes)
  },
  filtrarPorAno: function(consumos, ano){
    return filtrarPorAno(consumos, ano)
  }

}
