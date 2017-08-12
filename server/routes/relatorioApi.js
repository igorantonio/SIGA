var express = require('express');
var router = express.Router();
var passport = require('passport');
var json2csv = require('json2csv');
var fs = require('fs');
var Edificio = require('../models/edificio.js');

router.get('/relatorio/edificio/:edificio_id', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(error, edificio) {
    if (error) res.send(edificio);

    var myData = [
      {
        'nome': edificio.nome,
        'atividade': edificio.atividade,
        'caracteristicasFisicas.localizacao.setor': edificio.caracteristicasFisicas.localizacao.setor,
        'caracteristicasFisicas.localizacao.bloco': edificio.caracteristicasFisicas.localizacao.bloco,
        'caracteristicasFisicas.area': edificio.caracteristicasFisicas.area,
        'caracteristicasFisicas.volumeReservatorio': edificio.caracteristicasFisicas.volumeReservatorio,
        'mediaEsperada': edificio.mediaEsperada,
        'historicoConsumo.consumo': edificio.historicoConsumo.consumo,
        'historicoConsumo.data': edificio.historicoConsumo.data,
        'vazamentos.volume': edificio.vazamentos.volume,
        'alertas.data': edificio.alertas.data
      }
    ];

    var fields = ['nome', 'atividade', 'caracteristicasFisicas.localizacao.setor', 
    'caracteristicasFisicas.localizacao.bloco', 'caracteristicasFisicas.area', 'caracteristicasFisicas.volumeReservatorio', 
    'mediaEsperada', 'historicoConsumo.consumo', 'historicoConsumo.data', 'vazamentos.volume', 'vazamentos.data', 
    'alertas.data'];
    var fieldNames = ['Nome', 'Atividade', 'Setor', 'Bloco', 'Area', 'Volume do Reservatorio', 'Media Esperada', 
    'Consumo', 'Data do Consumo', 'Vazamento', 'Data do Vazamento', 'Data do Alerta'];
    var opts = {
      data: myData,
      fields: fields,
      fieldNames: fieldNames,
      quotes: ''
    };

    var csv = json2csv(opts);
 
    fs.writeFile('file.csv', csv, function(err) {
        if (err) throw err;
        console.log('file saved');
    });
    res.json(edificio);
    });
}); 

module.exports = router;