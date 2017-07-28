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



router.post('/edificio/:edificio_id/consumoDiario/new', function(req,res){
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
  /*if (!validarEdificio(edificio, res)){
    return;
    }*/
  if (req.body.consumoDiario == null){
    edificio.consumoDiario = [];
  };
  edificio.save(function(error){
    if(error) res.send(error);
    else res.json(edificio);
  });

});

validarEdificio = function(edificio, res){
  valid = true;
  if (edificio == null){
    res.status(400).send('Something really wrong happend here!');
    valid = false;
  }
  /*else if (edificio.nome == null || edificio.nome == ""){
    res.status(400).send('The name chosen is not valid!');
    valid = false;
  }*/
  else if (edificio.descricao == null){
    res.status(400).send('The description chosen is not valid!');
    valid = false;
  }
  else if(edificio.geolocalizacao==null || edificio.geolocalizacao.latitude == null || edificio.geolocalizacao.longitude ==null ){
    res.status(400).send('Geolocalization needs to be specified!');
  };
  return valid;
};

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