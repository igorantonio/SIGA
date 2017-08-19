var express = require('express');
var router = express.Router();
var passport = require('passport');
var json2csv = require('json2csv');
var PDFDocument = require('pdfkit');
var fs = require('fs');
var moment = require('moment');
var Edificio = require('../models/edificio.js');
var EstatisticaAPI = require('./estatisticaApi.js');
EstatisticaAPI = EstatisticaAPI.data;

router.get('/relatorio/edificio/:edificio_id/csv', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(err, edificio) {
    if (err) {
        res.status(400).json({error: err});
    }

    consumos    = edificio.historicoConsumo;
    vazamentos  = edificio.vazamentos;
    alertas     = edificio.alertas;
    console.log(consumos);
    console.log(vazamentos);
    console.log(alertas);

    cardinalidade = req.query.cardinalidade;
    if (cardinalidade) {
        if (cardinalidade == 'sem') {
            if (req.query.data) {
                mdataFinal = moment(req.query.data);
                mdataFinal.add(1, 'days');
                dataFinal = new Date(mdataFinal);
                mdataInicial = moment(dataFinal).subtract(7, 'days');
                dataInicial = new Date(mdataInicial);

                consumos    = EstatisticaAPI.filtrarRange(consumos, dataInicial, dataFinal);
                vazamentos  = EstatisticaAPI.filtrarRange(vazamentos, dataInicial, dataFinal);
                alertas     = EstatisticaAPI.filtrarRange(alertas, dataInicial, dataFinal);
            } else {
                res.status(400).send('Data não informada.');
            }
        } else if (cardinalidade == 'mes') {
            if (req.query.mes) {
                consumos    = EstatisticaAPI.filtrarPorMes(consumos, req.query.mes);
                vazamentos  = EstatisticaAPI.filtrarPorMes(vazamentos, req.query.mes);
                alertas     = EstatisticaAPI.filtrarPorMes(alertas, req.query.mes);
            } else {
                res.status(400).send('Mês não informada.');
            }
        } else if (cardinalidade == 'ano') {
            if (req.query.ano) {
                consumos    = EstatisticaAPI.filtrarPorAno(consumos, req.query.ano);
                vazamentos  = EstatisticaAPI.filtrarPorAno(vazamentos, req.query.ano);
                alertas     = EstatisticaAPI.filtrarPorAno(alertas, req.query.ano);
            } else {
                res.status(400).send('Ano não informada.');
            }
        }
    };

    var historicoConsumoString = '';
    for (var i = consumos.length - 1; i >= 0; i--) {
        historicoConsumoString += consumos[i].consumo.toString() + ' - ' + consumos[i].data.toString() + '\n';
    };

    var vazamentosString = '';
    for (var i = vazamentos.length - 1; i >= 0; i--) {
        vazamentosString += vazamentos[i].volume.toString() + ' - ' + vazamentos[i].data.toString() + '\n';
    };

    var alertasString = '';
    for (var i = alertas.length - 1; i >= 0; i--) {
        alertasString += alertas[i].data.toString() + '\n';
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
                  
    doc.fontSize(20);                    
    doc.text('Edificação: ' + edificio.nome, {
        align: 'center'
    });

    doc.moveDown();
    doc.fontSize(16);
    doc.text('Descrição Suscinta: ' + edificio.descricao);

    doc.moveDown();
    doc.text('Atividade Preponderante: ' + edificio.atividade);

    doc.moveDown();
    doc.text('Características Físicas:');
    doc.fontSize(14);
    doc.text('Localização = Setor ' + edificio.caracteristicasFisicas.localizacao.setor + ', Bloco ' + edificio.caracteristicasFisicas.localizacao.bloco);
    doc.text('Área = ' + edificio.caracteristicasFisicas.area + 'm²');
    doc.text('Nº de Pavimentos = ' + edificio.caracteristicasFisicas.n_pavimentos);
    doc.text('Ocupação Média = ' + edificio.caracteristicasFisicas.ocupacaoMedia);
    doc.text('Nº Bacias Sanitárias = ' + edificio.caracteristicasFisicas.n_baciasSanitarias);
    doc.text('Nº Torneiras = ' + edificio.caracteristicasFisicas.n_torneiras);
    doc.text('Nº Duchas = ' + edificio.caracteristicasFisicas.n_duchas);
    doc.text('Nº Chuveiros = ' + edificio.caracteristicasFisicas.n_chuveiros);
    doc.text('Nº Pias = ' + edificio.caracteristicasFisicas.n_pias);
    doc.text('Volume do Reservatório = ' + edificio.caracteristicasFisicas.volumeReservatorio + 'm³');

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
    doc.text('Consumo Mínimo:');

    doc.end();
    res.json(edificio);
    });
});

module.exports = router;