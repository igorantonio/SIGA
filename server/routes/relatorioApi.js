var express = require('express');
var router = express.Router();
var passport = require('passport');
var json2csv = require('json2csv');
var fs = require('fs');
var moment = require('moment');
var Edificio = require('../models/edificio.js');
var EstatisticaAPI = require('./estatisticaApi.js');
EstatisticaAPI = EstatisticaAPI.data;
EdificioAPI = require('./edificioApi.js');


var localized = d3.locale({
          "decimal": ",",
          "thousands": ".",
          "grouping": [3],
          "currency": ["R$", ""],
          "dateTime": "%d/%m/%Y %H:%M:%S",
          "date": "%d/%m/%Y",
          "time": "%H:%M:%S",
          "periods": ["AM", "PM"],
          "days": ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
          "shortDays": ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
          "months": ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
          "shortMonths": ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
        });


// EXMEMPLO localhost:3000/relatorio/edificio/:edifico_id/csv?granularidade=sem&data=2017-08-19
router.get('/relatorio/edificio/:edificio_id/csv/consumos', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(err, edificio) {
        if (err) {
            res.status(400).json({error: err});
        }

        consumos    = edificio.historicoConsumo;

        if (req.query.inicio && req.query.fim) {
                consumos = EstatisticaAPI.data.filtrarRange(consumos, req.query.inicio, req.query.fim);
            };

        granularidade = req.query.granularidade;
        if (granularidade) {
            consumos = EdificioAPI.data.granularidade(consumos,granularidade);
        };
        consumosFiltrados = [];
            for (key in consumos){
                data = new Date(key);
                var newConsumo = {
                    data: data.getTime() - data.getTimezoneOffset() * 60 * 1000,
                    consumo: consumos[key]
                };
                consumosFiltrados.push(newConsumo);
            };
            consumosFiltrados.sort(function(a, b) {
              return a.data - b.data;
             });
        consumosFiltrados.forEach(function(consumo){
           switch (granularidade) {
           case 'anual':
                consumo.data = localized.timeFormat('%Y')(new Date(consumo.data));
                break;
            case 'mensal':
                consumo.data = localized.timeFormat('%m/%Y')(new Date(consumo.data));
                break;
            case 'diario':
                consumo.data = localized.timeFormat('%d/%m/%Y')(new Date(consumo.data));
                break;
            case 'detalhado':
                consumo.data = localized.timeFormat('%d/%m/%Y - %H:%M:%S')(new Date(consumo.data));
                break;
            default:
                consumo.data = localized.timeFormat('%d/%m/%Y')(new Date(consumo.data));
            };

        });

 /*
            if (granularidade == 'sem') {
                if (req.query.data) {
                    mdataFinal = moment(req.query.data);
                    mdataFinal.add(1, 'days');
                    dataFinal = new Date(mdataFinal);
                    mdataInicial = moment(dataFinal).subtract(7, 'days');
                    dataInicial = new Date(mdataInicial);

                    consumos    = EstatisticaAPI.filtrarRange(consumos, dataInicial, dataFinal);
                } else {
                    res.status(400).send('Data não informada.');
                }
            } else if (granularidade == 'mes') {
                if (req.query.mes) {
                    consumos    = EstatisticaAPI.filtrarPorMes(consumos, req.query.mes);
                } else {
                    res.status(400).send('Mês não informado.');
                }
            } else if (granularidade == 'ano') {
                if (req.query.ano) {
                    consumos    = EstatisticaAPI.filtrarPorAno(consumos, req.query.ano);
                } else {
                    res.status(400).send('Ano não informado.');
                }
            }
        };*/

        var fields = [
        
        {
            label: 'Data',
            value: 'data'
        },
        {
            label: 'Consumo',
            value: 'consumo'
        },];

        var opts = {
          data: consumosFiltrados,
          fields: fields,
          unwindPath: ['consumo'],
          quotes: ''
        };

        var csv = json2csv(opts);
        var filePath = 'consumos_' + edificio.nome + '.csv';
     
        fs.writeFile(filePath, csv, function(err) {
            if (err) {
                res.status(400).json({error: err});
            }
        });
        res.status(200).download(filePath);
    });
});

router.get('/relatorio/edificio/:edificio_id/csv/vazamentos', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(err, edificio) {
        if (err) {
            res.status(400).json({error: err});
        }

        vazamentos  = edificio.vazamentos;

        granularidade = req.query.granularidade;
        if (granularidade) {
            if (granularidade == 'sem') {
                if (req.query.data) {
                    mdataFinal = moment(req.query.data);
                    mdataFinal.add(1, 'days');
                    dataFinal = new Date(mdataFinal);
                    mdataInicial = moment(dataFinal).subtract(7, 'days');
                    dataInicial = new Date(mdataInicial);

                    vazamentos  = EstatisticaAPI.filtrarRange(vazamentos, dataInicial, dataFinal);
                } else {
                    res.status(400).send('Data não informada.');
                }
            } else if (granularidade == 'mes') {
                if (req.query.mes) {
                    vazamentos  = EstatisticaAPI.filtrarPorMes(vazamentos, req.query.mes);
                } else {
                    res.status(400).send('Mês não informado.');
                }
            } else if (granularidade == 'ano') {
                if (req.query.ano) {
                    vazamentos  = EstatisticaAPI.filtrarPorMes(vazamentos, req.query.ano);
                } else {
                    res.status(400).send('Ano não informado.');
                }
            }
        };

        var fields = [
        {
            label: 'Volume',
            value: 'volume'
        },
        {
            label: 'Data',
            value: 'data'
        }];

        var opts = {
          data: vazamentos,
          fields: fields,
          unwindPath: ['volume'],
          quotes: ''
        };

        var csv = json2csv(opts);
        var filePath = 'vazamentos_' + edificio.nome + '.csv';
     
        fs.writeFile(filePath, csv, function(err) {
            if (err) throw err;
            console.log('file saved');
        });
        res.status(200).download(filePath);
    });
});

router.get('/relatorio/edificio/:edificio_id/csv/alertas', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(err, edificio) {
        if (err) {
            res.status(400).json({error: err});
        }

        alertas  = edificio.alertas;

        granularidade = req.query.granularidade;
        if (granularidade) {
            if (granularidade == 'sem') {
                if (req.query.data) {
                    mdataFinal = moment(req.query.data);
                    mdataFinal.add(1, 'days');
                    dataFinal = new Date(mdataFinal);
                    mdataInicial = moment(dataFinal).subtract(7, 'days');
                    dataInicial = new Date(mdataInicial);

                    alertas     = EstatisticaAPI.filtrarRange(alertas, dataInicial, dataFinal);
                } else {
                    res.status(400).send('Data não informada.');
                }
            } else if (granularidade == 'mes') {
                if (req.query.mes) {
                    alertas     = EstatisticaAPI.filtrarPorMes(alertas, req.query.mes);
                } else {
                    res.status(400).send('Mês não informado.');
                }
            } else if (granularidade == 'ano') {
                if (req.query.ano) {
                    alertas     = EstatisticaAPI.filtrarPorMes(alertas, req.query.ano);
                } else {
                    res.status(400).send('Ano não informado.');
                }
            }
        };

        var fields = [
        {
            label: 'Data',
            value: 'data'
        }];

        var opts = {
          data: alertas,
          fields: fields,
          unwindPath: ['data'],
          quotes: ''
        };

        var csv = json2csv(opts);
        var filePath = 'alertas_' + edificio.nome + '.csv';
     
        fs.writeFile(filePath, csv, function(err) {
            if (err) throw err;
            console.log('file saved');
        });
        res.status(200).download(filePath);
    });
});  

router.get('/relatorio/edificio/:edificio_id/pdf', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(error, edificio) {
    if (error) {
        res.status(400).json({error: error});
    }
    consumos    = edificio.historicoConsumo;
    vazamentos  = edificio.vazamentos;
    alertas     = edificio.alertas;

    granularidade = req.query.granularidade;
    if (granularidade) {
        if (granularidade == 'sem') {
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
        } else if (granularidade == 'mes') {
            if (req.query.mes) {
                consumos    = EstatisticaAPI.filtrarPorMes(consumos, req.query.mes);
                vazamentos  = EstatisticaAPI.filtrarPorMes(vazamentos, req.query.mes);
                alertas     = EstatisticaAPI.filtrarPorMes(alertas, req.query.mes);
            } else {
                res.status(400).send('Mês não informado.');
            }
        } else if (granularidade == 'ano') {
            if (req.query.ano) {
                consumos    = EstatisticaAPI.filtrarPorAno(consumos, req.query.ano);
                vazamentos  = EstatisticaAPI.filtrarPorAno(vazamentos, req.query.ano);
                alertas     = EstatisticaAPI.filtrarPorAno(alertas, req.query.ano);
            } else {
                res.status(400).send('Ano não informado.');
            }
        }
    };

    var consumosF = [['DATA', 'CONSUMO (m³)']];
    consumos.forEach(function(consumo){
        data = d3.time.format('%d/%m/%Y')(new Date(consumo.data));
        consumosF.push([data, consumo.consumo.toString()]);
    });



    var vazamentosF = [[ 'DATA', 'VOLUME (m³)']];

    vazamentos.forEach(function(vazamento){
        data = d3.time.format('%d/%m/%Y')(new Date(vazamento.data));
        vazamentosF.push([data, vazamento.volume.toString()]);
    })
    
    if (vazamentosF.length ==0){
        vazamentosF =['--',['--']]
    }

    var alertasF =  [[ 'DATA', 'VERIFICADO EM']];
    alertas.forEach(function(alerta){
        data = d3.time.format('%d/%m/%Y')(new Date(alertas.data));;
        alertasF.push([data,'--']);
    })
   
    if (alertasF.length ==0){
        alertasF =['--',['--']]
    }
    if (consumosF.length ==0){
        consumosF =['--',['--']]
    }

    var estatisticas = EstatisticaAPI.calculaEstatisticas(consumos);

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
            {text: 'Edificação: ' + edificio.nome + '\n', fontSize: 20 },
            {text: [
                { text: 'Descrição Sucinta: ', style: style['title'] }, { text: edificio.descricao + '\n', fontSize: 16},
                { text: 'Atividade Preponderante: ', style: style['title'] }, { text: edificio.atividade + '\n', fontSize:16},
                { text: 'Características Físicas:' + '\n', style: style['title'] },
                { text: 'Localização = Setor ' + edificio.caracteristicasFisicas.localizacao.setor + ', Bloco ' + edificio.caracteristicasFisicas.localizacao.bloco + '\n', style: style['body'] },
                { text: 'Área = ' + edificio.caracteristicasFisicas.area + 'm²' + '\n', style: style['body'] },
                { text: 'Nº de Pavimentos = ' + edificio.caracteristicasFisicas.n_pavimentos + '\n', style: style['body'] },
                { text: 'Ocupação Média = ' + edificio.caracteristicasFisicas.ocupacaoMedia + '\n', style: style['body'] },
                { text: 'Nº Bacias Sanitárias = ' + edificio.caracteristicasFisicas.n_baciasSanitarias + '\n', style: style['body'] },
                { text: 'Nº Torneiras = ' + edificio.caracteristicasFisicas.n_torneiras + '\n', style: style['body'] },
                { text: 'Nº Duchas = ' + edificio.caracteristicasFisicas.n_duchas + '\n', style: style['body'] },
                { text: 'Nº Chuveiros = ' + edificio.caracteristicasFisicas.n_chuveiros + '\n', style: style['body'] },
                { text: 'Nº Pias = ' + edificio.caracteristicasFisicas.n_pias + '\n', style: style['body'] },
                { text: 'Volume do Reservatório = ' + edificio.caracteristicasFisicas.volumeReservatorio + 'm³' + '\n' + '\n', style: style['body'] },
                { text: 'Consumo de Água' + '\n', style: style['title'] }] 
            },
            {table: {
                headerRows: 1,
                body: consumosF                    
                }
            },
            { text: '\n' + 'Vazamentos:' + '\n', style: style['title'] },
            {table: {
                headerRows: 1,

                body: vazamentosF
                }
            },
            { text: '\n' + 'Alertas:' + '\n', style: style['title'] },
            {table: {
                headerRows: 1,

                body: alertasF
                }
            },
            { text: '\n' + 'Consumo total: ' + estatisticas.total + 'm³' + '\n', style: style['title'] },
            { text: 'Consumo médio: ' + estatisticas.media + 'm³' + '\n', style: style['title'] },
            { text: 'Consumo médio esperado: ' + edificio.mediaEsperada + 'm³' + '\n', style: style['title'] },
            { text: 'Consumo máximo: ' + estatisticas.maximo + 'm³' + '\n', style: style['title'] },
            { text: 'Consumo mínimo: ' + estatisticas.minimo + 'm³' + '\n', style: style['title'] }
        ],
        
    };
    res.send(docDefinition);
    });
});

module.exports = router;