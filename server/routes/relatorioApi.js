var express = require('express');
var router = express.Router();
var passport = require('passport');
var json2csv = require('json2csv');
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


    var filePath = edificio.nome + '.pdf';
    var style= {
            title: {
                fontSize: 16,
                bold: true
            },
            body: {
                fontSize: 14
            }
        };

    

    var docDefinition = {
        content: [
            {text: 'Edificação: ' + edificio.nome, fontSize: 20 },
            {text: [
                { text: 'Descrição Suscinta: ' + edificio.descricao, style: style['title'] },
                { text: 'Atividade Preponderante: ' + edificio.atividade, style:'title' },
                { text: 'Características Físicas:', style:'title' },
                { text: 'Localização = Setor ' + edificio.caracteristicasFisicas.localizacao.setor + ', Bloco ' + edificio.caracteristicasFisicas.localizacao.bloco, style: style['body'] },
                { text: 'Área = ' + edificio.caracteristicasFisicas.area + 'm²', style:'body' },
                { text: 'Nº de Pavimentos = ' + edificio.caracteristicasFisicas.n_pavimentos, style:'body' },
                { text: 'Ocupação Média = ' + edificio.caracteristicasFisicas.ocupacaoMedia, style:'body' },
                { text: 'Nº Bacias Sanitárias = ' + edificio.caracteristicasFisicas.n_baciasSanitarias, style:'body' },
                { text: 'Nº Torneiras = ' + edificio.caracteristicasFisicas.n_torneiras, style:'body' },
                { text: 'Nº Duchas = ' + edificio.caracteristicasFisicas.n_duchas, style:'body' },
                { text: 'Nº Chuveiros = ' + edificio.caracteristicasFisicas.n_chuveiros, style:'body' },
                { text: 'Nº Pias = ' + edificio.caracteristicasFisicas.n_pias, style:'body' },
                { text: 'Volume do Reservatório = ' + edificio.caracteristicasFisicas.volumeReservatorio + 'm³', style:'body' },
                { text: 'Consumo de Água', style: 'title' },
                { text: 'Por Dia:', style: 'body' }] 
            },
            {table: {
                headerRows: 1,

                body: [
                    [ 'First', 'Second', 'Third', 'The last one' ],
                    [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
                    [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
                    ]
                }
            }
        ],
        
    };

/*

    doc.moveDown();
    doc.fontSize(16);
    doc.text('Consumo de Água:');
    doc.fontSize(14);
    doc.text('Por Dia:');
    doc.text('Por Mês:');

    doc.moveDown();
    doc.fontSize(16);
    doc.text('Estatísticas do Consumo de Água:');
    doc.fontSize(14);
    doc.text('Consumo Total:');
    doc.text('Consumo Médio:');
    doc.text('Consumo Médio Esperado:');
    doc.text('Consumo Máximo:');
    doc.text('Consumo Mínimo:');*/
    res.send(docDefinition);
    //res.json(edificio);
    });
});

module.exports = router;