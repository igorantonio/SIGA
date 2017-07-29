var express = require('express');
var router = express.Router();
var passport = require('passport');
var EstatisticaAPI = require('./EstatisticaApi.js');
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

router.get('/edificio/:edificio_id/consumo', function(req,res){
  Edificio.findById(req.params.edificio_id, function(error,edificio){
        if(error) {
          res.send(edificio);
          return;
        };
    consumos = edificio.consumoDiario;
  if (req.query.ano != null){
      consumos = EstatisticaAPI.data.filtrarPorAno(consumos, req.query.ano);
    };
    if (req.query.mes != null){
      consumos = EstatisticaAPI.data.filtrarPorMes(consumos, req.query.mes);
    };
    if (req.query.dia != null){
      consumos = EstatisticaAPI.data.filtrarPorDia(consumos, req.query.dia);
    };
    if (req.query.inicio != null && req.query.fim != null){
      consumos = EstatisticaAPI.data.filtrarRange(consumos, req.query.inicio, req.query.fim);
    };
    consumosFiltrados = [];
    consumos.forEach(function(cd){
      var newConsumo = {dia: cd.dia, consumo: cd.consumo};
      consumosFiltrados.push(newConsumo);
    });
    res.json(consumosFiltrados);

  }

)});

router.post('/edificio/:edificio_id/consumo/new', function(req,res){
  if (req.body.dia == null){
    res.send('Deu ruim');
    return;
      };
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

var filtrarPorSetor = function(setor,edificios){
  edificiosFiltrados = [];
  edificios.forEach(function(edificio){
    if (edificio.caracteristicasFisicas.localizacao.setor == setor){
     edificiosFiltrados.push(edificio);
  }
  });
  return edificiosFiltrados;
}

router.post('/edificio', function(req,res){
var edificio = new Edificio();
  edificio.nome = req.body.nome;
  edificio.descricao = req.body.descricao;
  edificio.atividade = req.body.atividade;
  edificio.caracteristicasFisicas = req.body.caracteristicasFisicas;
  edificio.geolocalizacao = req.body.geolocalizacao;
  edificio.consumoDiario = req.body.consumoDiario;
  if (req.body.consumoDiario == null){
    edificio.consumoDiario = [];
  };
  edificio.save(function(error){
    if(error) res.send(error);
    else res.json(edificio);
  });

});

router.get('/edificio', function(req,res){
  Edificio.find(function(err, edificios){
    if (req.query.setor != null){
      edificios = filtrarPorSetor(req.query.setor, edificios);
    }
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

