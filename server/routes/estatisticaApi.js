var express = require('express');
var router = express.Router();
var passport = require('passport');
var moment = require('moment');

var User = require('../models/user.js');
var Edificio = require('../models/edificio.js');
var CaixaDeAgua = require('../models/caixaDeAgua.js');


// Estatisticas referentes a edificios
router.get('/estatistica/edificio/:edificio_id', function(req,res){
  Edificio.findById(req.params.edificio_id, function(error, edificio){
    if(error) res.send(edificio);
    sum = 0.0;
    max = -1.0;
    min =  9999999;
    
    var consumos = edificio.historicoConsumo;
    if (req.query.ano != null){
      consumos = filtrarPorAno(consumos, req.query.ano);
    };
    if (req.query.mes != null){
      if  (!verificarMes(req.query.mes)){
        res.status(422);
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


router.get('/estatistica/caixa/:caixa_id', function(req,res){
  CaixaDeAgua.findById(req.params.caixa_id, function(error, caixa){
    if(error) res.send(caixa);
    sum = 0.0;
    max = -1.0;
    min =  9999999;
    
    var consumos = caixa.historicoConsumo;
    if (req.query.ano != null){
      consumos = filtrarPorAno(consumos, req.query.ano);
    };
    if (req.query.mes != null){
      if  (!verificarMes(req.query.mes)){
        res.status(422);
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


var calculaEstatisticas = function(consumos){
  var sum = 0.0;
  var max = 0;
  var min = 0;
  var acum = 0;
  var med = 0;
  var maxdata;
  var mindata;
  total = consumos.length;

  if (total != 0){
  var max = -1;
  var min = 9999999999;
  consumos.forEach(function(cd){
    var consumo = cd.consumo;
    acum += consumo;
    sum += consumo;
    if (consumo> max){
      max = consumo;
      maxdata = cd.data;
    };
    if (min > consumo){
      min = consumo;
      mindata = cd.data;
    };
  });
  med = sum/total;
  };
  if (total==0){
    return{acum: 0, media:0, total:0, maximo:0, minimo:0};
  };
  
  return {total: acum, media: med, total: sum, maximo:max, data_max:maxdata, minimo: min, data_minimo: mindata};
};

var filtrarPorAno = function(consumos, ano){
  var consumosFiltrados = [];
  consumos.forEach(function(cd){
    if (cd.data.getFullYear() == ano ){
        consumosFiltrados.push(cd);
    };
  });
  return consumosFiltrados;
};

var filtrarPorMes = function(consumos, mes){
  var consumosFiltrados = [];
  consumos.forEach(function(cd){
    if (cd.data.getMonth() == mes-1){
      consumosFiltrados.push(cd);
    };
  });
  return consumosFiltrados;
};

var filtrarPorDia = function(consumos, dia){
  var consumosFiltrados =[];
  consumos.forEach(function(cd){
    if (cd.data.getDate() == dia){
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
if (cd.data.getTime() >= startDate.getTime() && cd.data.getTime() <= endDate.getTime()){
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
      consumos = consumos.concat(edificios[i].historicoConsumo);
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
  },
  calculaEstatisticas: function(consumos){
    return calculaEstatisticas(consumos)
  }

}
