angular.module('myApp')
    .controller('ChartController', ['$scope', 'edificioService', '$http', '$mdDialog', function($scope, edificioService, $http, $mdDialog) {
        self = this;
        $scope.texto_granularidade = "Diário";
        $scope.gran = edificioService.getGranularidade();


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


        /* Definição de Variáveis auxiliares
         */
        var GRANULARIDADE_ANO = 'year';
        var GRANULARIDADE_MES = 'month';
        var GRANULARIDADE_DIA = 'day';
        var GRANULARIDADE_HORA = 'hour';
        var chart;
        var chartData;
        var originatorEv;

        this.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };


        var ED_ROUT = "/edificio/" + edificioService.getEdificioId() + "/consumo";
        var CAIXA_ROUT = "/caixa/" + edificioService.getEdificioId() + "/consumo";
        var UFCG_ROUT = "/universidade/consumo";
        var params = {};
        var ROUTE;

        $scope.data = [{
            key: 'Consumo',
            values: [{
                x: 0,
                y: 0,
            }],
            area: true,
        }];

        // Filtragem (Range)

        self.inicialDate = new Date();
        self.finalDate = new Date();
        self.isOpen = false;

        



        // CRIAÇÃO DE GRAFICO
        nv.addGraph(function() {
            chart = nv.models.lineChart().margin({
                    top: 5,
                    right: 50,
                    bottom: 38,
                    left: 40
                }).color(["lightgrey", "rgba(242,94,34,0.58)"])
                //.width(600)
                //.useInteractiveGuideline(false)
                //.transitionDuration(350)
                .showLegend(true).showYAxis(true)
                .showXAxis(true);

            chart.xScale(d3.time.scale()); // Defines that the X-Axis is time measured.


            updateLook(); // Atualização de Estilos e Detalhes do Gráfico
            // Assign the SVG selction
            chartData = d3.select('#economyChart svg').datum($scope.data);
            chartData.transition().duration(500).call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
        });


        var updateLook = function() {
            updateText();
            chart.yAxis
                .axisLabel('Consumo')
                .tickFormat(d3.format('.2f'));

            chart.xAxis
                .axisLabel('Período')
                .ticks(d3.time.dats, 1)
                .tickValues($scope.data[0]['ticks']);

            if ($scope.gran == GRANULARIDADE_ANO) {
                chart.xAxis
                    .axisLabel('Período')
                    .tickFormat(function(d) {
                        return localized.timeFormat('%Y')(new Date(d));
                    })
                    .ticks(d3.time.dats, 1)
                    .tickValues($scope.data[0]['ticks']);

            } else if ($scope.gran == GRANULARIDADE_DIA) {
                chart.xAxis
                    .axisLabel('Período')
                    .orient("bottom")
                    .ticks(d3.time.day, 10);
                    chart.xAxis.tickFormat(function(d) {
	                        	return localized.timeFormat('%b %d')(new Date(d));
	                   })
                    // Adiciona detalhamento caso o range seja maior que um ano.
	                if ($scope.data[0].values.length > 1){
	                	ultimadata = moment($scope.data[0].values[$scope.data[0].values.length - 1].x);
	                	primeiradata = moment($scope.data[0].values[0].x);

	             		if(!ultimadata.isSame(primeiradata), GRANULARIDADE_ANO) {
	                    	chart.xAxis.tickFormat(function(d) {
	                        	return localized.timeFormat('%d %b %Y')(new Date(d));
	                    })
	                	} 

	            }
        	} else if ($scope.gran == GRANULARIDADE_MES) {
        		chart.xAxis.tickFormat(function(d) {
	                        	return localized.timeFormat('%b')(new Date(d));
	                    })
	            	 if ($scope.data[0].values.length > 1){
	                	ultimadata = moment($scope.data[0].values[$scope.data[0].values.length - 1].x);
	                	primeiradata = moment($scope.data[0].values[0].x);

	             		if(!ultimadata.isSame(primeiradata), GRANULARIDADE_ANO) {
	                    	chart.xAxis.tickFormat(function(d) {
	                        	return localized.timeFormat('%b %Y')(new Date(d));
	                    })
	                	} 

	            }
        	} else if ($scope.gran == GRANULARIDADE_HORA) {
                chart.xAxis
                    .tickFormat(function(d) {
                        return localized.timeFormat('%d/%b - %H:%M:%S')(new Date(d));
                    })
                    .tickValues($scope.data[0]['ticks']);
            } else {
                chart.xAxis
                    .axisLabel('Período')
                    .tickFormat(function(d) {
                        return localized.timeFormat('%b %d %y')(new Date(d));
                    })
                    .ticks(d3.time.dats, 1);
            };
            if (chartData) chartData.datum($scope.data).transition().duration(500).call(chart);
            nv.utils.windowResize(chart.update);

        };




        $scope.update = function() {
        	var granularidade_rota;
        	switch ($scope.gran) {
                case GRANULARIDADE_ANO:
                    gran = 'anual';
                    break;
                case GRANULARIDADE_MES:
                    gran = 'mensal';
                    break;
                case GRANULARIDADE_DIA:
                    gran = 'diario';
                    break;
                case GRANULARIDADE_HORA:
                    gran = 'detalhado';
                    break;
                default:
                    gran = 'diario';
            };


            params.granularidade = $scope.gran;

            $scope.loadData();
            var data = $scope.data;
            updateLook();
            if (chartData) chartData.datum(data).transition().duration(500).call(chart);

            // Update the SVG with the new data and call chart

        };
        d3.select("#update").on("click", $scope.update);




        $scope.loadData = function() {
            if (edificioService.isCaixa()) {
                ROUTE = CAIXA_ROUT;

            } else if (edificioService.isUFCG()) {
                ROUTE = UFCG_ROUT;

            } else {
                ROUTE = ED_ROUT;
            };

            $http.get(ROUTE, {
                    params: params
                })
                .then(function(response, ev) {
                    $scope.data = [{
                        key: 'Data',
                        values: response.data,
                        area: true,
                        gran: $scope.gran,
                        ticks: getTicks(response.data, $scope.gran)

                    }];
                    if (chart) updateLook();
                    $scope.estatisticas = calculaEstatisticas($scope.data[0].values);



                }, function() {
                    $scope.data = "error in fetching data"; //return if error on fetch
                });
        };

        


        var getTicks = function(xy, granularidade) {
            ticks = [];
            if (granularidade == "year") {
                xy.forEach(function(x) {
                    ano = moment(x).year();
                    if (ticks.indexOf(ano) == -1) {
                        ticks.push(x.x);
                    }
                });

            } else if (granularidade == "day") {
                xy.forEach(function(x) {
                    dia = x.x;
                    if (ticks.indexOf(dia) == -1) {
                        if (ticks.length >= 1 && ((x.x - ticks[ticks.length - 1]) >= 1000 * 60 * 60 * 24 * 15)) {
                            ticks.push(x.x);
                        } else if (ticks.length == 0) {
                            ticks.push(x.x)
                        }
                    }
                });
            } else {
                xy.forEach(function(x) {
                    if (ticks.indexOf(x.x) == -1) {
                        ticks.push(x.x);
                    }

                })
            };



            return ticks;
        };

/*
         *Agrupamento de dados
         */

        this.agrupar = function(index) {
            var ANUAL = 0;
            var MENSAL = 1;
            var DIARIO = 2;
            var DETALHADO = 3;
            switch (index) {
                case ANUAL:
                    $scope.gran = GRANULARIDADE_ANO;
                    break;
                case MENSAL:
                    $scope.gran = GRANULARIDADE_MES;
                    break;
                case DIARIO:
                    $scope.gran = GRANULARIDADE_DIA;
                    break;
                case DETALHADO:
                    $scope.gran = GRANULARIDADE_HORA;
                    break;
                default:
                    $scope.gran = GRANULARIDADE_DIA;
            }
            $scope.update();

        };


        // Atualização do texto de exibição
        var updateText = function() {
            if ($scope.gran == GRANULARIDADE_MES) {
                $scope.texto_granularidade = "Mensal";
            } else if ($scope.gran == GRANULARIDADE_ANO) {
                $scope.texto_granularidade = "Anual"

            } else if ($scope.gran == GRANULARIDADE_DIA) {
                $scope.texto_granularidade = "Diário"
            } else if ($scope.gran == GRANULARIDADE_HORA) {
                $scope.texto_granularidade = "Detalhado"
            };
        };

        // Recarregar os dados levando em consideração o Range
        $scope.reload = function() {
            params.inicio = self.inicialDate;
            params.fim = self.finalDate;
            $scope.update();
            updateText();
        };

        $scope.estatisticas = {};

        $scope.estatisticas.total = 0;



        var calculaEstatisticas = function(consumos){
		  var sum = 0.0;
		  var max = -1;
		  var min = 9999999999;
		  var acum = 0;
		  var maxdata;
		  var mindata;
		  consumos.forEach(function(cd){
		    var consumo = cd.y;
		    acum += consumo;
		    sum += consumo;
		    if (consumo> max){
		      max = consumo;
		      maxdata = cd.x;
		    };
		    if (min > consumo){
		      min = consumo;
		      mindata = cd.x;
		    };
		  });
		  total = consumos.length;
		  if (consumos.length>=1){
			  maisnova = moment(consumos[total-1].x);
			  maisantiga = moment(consumos[0].x);
			  if ($scope.gran== GRANULARIDADE_MES){
			  	media = sum / (maisnova.diff(maisantiga, 'months') +1);
			  }
			  else if ($scope.gran== GRANULARIDADE_ANO){
			  	media = sum / (maisnova.diff(maisantiga, 'years') +1);
			  }
			  else if($scope.gran == GRANULARIDADE_DIA){
			  	media = sum / (maisnova.diff(maisantiga, 'days') +1);
			  }
			  else if($scope.gran == GRANULARIDADE_HORA){
			  	media = sum / (maisnova.diff(maisantiga, 'hours') +1);
			  }
			}
		  else{
		  	console.log($scope.gran);
		  	media = sum/total;
		  }
		  return {total: acum, media: media, total: sum, maximo:max, data_max:maxdata, minimo: min, data_minimo: mindata};
		};




        
        var load = function() {
            $scope.loadData();
        };

        load();

        



    }]);