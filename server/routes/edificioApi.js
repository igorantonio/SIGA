var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.js');
var Edificio = require('../models/edificio.js');

///Building's API
router.post('/edificio', function(req,res){
var edificio = new Edificio();
  edificio.nome = req.body.nome;
  edificio.descricao = req.body.descricao;
  edificio.atividade = req.body.atividade;
  edificio.save(function(error){
    if(error) res.send(error);
    res.json({message: 'Predio criado com sucesso!'});
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

module.exports = router;