var express = require('express');
var router = express.Router();
var passport = require('passport');
var json2csv = require('json2csv');
var PDFDocument = require('pdfkit');
var fs = require('fs');
var Edificio = require('../models/edificio.js');

router.get('/relatorio/edificio/:edificio_id/csv', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(error, edificio) {
    if (error) res.send(edificio);

    var historicoConsumoString = '';
    for (var i = edificio.historicoConsumo.length - 1; i >= 0; i--) {
        historicoConsumoString += edificio.historicoConsumo[i].consumo.toString() + ' - ' + edificio.historicoConsumo[i].data.toString() + '\n';
    };

    var vazamentosString = '';
    for (var i = edificio.vazamentos.length - 1; i >= 0; i--) {
        vazamentosString += edificio.vazamentos[i].volume.toString() + ' - ' + edificio.vazamentos[i].data.toString() + '\n';
    };

    var alertasString = '';
    for (var i = edificio.alertas.length - 1; i >= 0; i--) {
        alertasString += edificio.alertas[i].data.toString() + '\n';
    };

    var myData = [
      {
        'caracteristicasFisicas.localizacao.setor': edificio.caracteristicasFisicas.localizacao.setor,
        'caracteristicasFisicas.localizacao.bloco': edificio.caracteristicasFisicas.localizacao.bloco,
        'caracteristicasFisicas.area': edificio.caracteristicasFisicas.area,
        'caracteristicasFisicas.volumeReservatorio': edificio.caracteristicasFisicas.volumeReservatorio,
        'mediaEsperada': edificio.mediaEsperada,
        'historicoConsumo': historicoConsumoString,
        'vazamentos': vazamentosString,
        'alertas': alertasString
      }
    ];

    var fields = [
    {
        label: 'Setor',
        value: 'caracteristicasFisicas.localizacao.setor'
    },
    {
        label: 'Bloco',
        value: 'caracteristicasFisicas.localizacao.bloco'
    },
    {
        label: 'Area',
        value: 'caracteristicasFisicas.area'
    },
    {
        label: 'Volume do Reservatorio',
        value: 'caracteristicasFisicas.volumeReservatorio'
    },
    {
        label: 'Media Esperada',
        value: 'mediaEsperada'
    },
    {
        label: 'Consumo',
        value: 'historicoConsumo'
    },
    {
        label: 'Vazamento',
        value: 'vazamentos'
    },
    {
        label: 'Alerta',
        value: 'alertas'
    }];

    var opts = {
      data: myData,
      fields: fields,
      //unwindPath: ['historicoConsumo', 'vazamentos', 'alertas'],
      quotes: ''
    };

    var csv = json2csv(opts);
    var filePath = edificio.nome + '.csv';
 
    fs.writeFile(filePath, csv, function(err) {
        if (err) throw err;
        console.log('file saved');
    });
    res.json(edificio);
    });
}); 

router.get('/relatorio/edificio/:edificio_id/pdf', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(error, edificio) {
    if (error) res.send(edificio);

    var doc = new PDFDocument;
    var filePath = edificio.nome + '.pdf';
    doc.pipe(fs.createWriteStream(filePath)); 
                  
    doc.fontSize(18);                    
    doc.text(edificio.nome, {
        align: 'center'
    });

    doc.moveDown();
    doc.fontSize(10);
    doc.text(edificio.descricao);
    doc.text(edificio.atividade);

    doc.moveDown();
    var route = "/estatistica/edificio/:edificio_id";
    var stats = $http.get(route);
    doc.text(stats);

    doc.end();
    res.json(edificio);
    });
});

module.exports = router;