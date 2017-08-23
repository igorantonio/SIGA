angular.module('myApp')
	.controller('ChartController', ['$scope', 'edificioService', '$http', '$mdDialog', function ($scope, edificioService, $http, $mdDialog) {
		self = this;
		$scope.texto_granularidade = "Diário";
		$scope.gran = edificioService.getGranularidade();


		/* Definição de Variáveis auxiliares
		*/
		var GRANULARIDADE_ANO= 'year';
		var GRANULARIDADE_MES= 'month';
		var GRANULARIDADE_DIA= 'day';
		var chart;
		var chartData;
		var originatorEv;

		 this.openMenu = function ($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
    };

    this.agrupar = function(index) {
    	var ANUAL = 0;
    	var MENSAL = 1;
    	var DIARIA = 2;
    	switch(index) {
	    case ANUAL:
	        $scope.gran = GRANULARIDADE_ANO;
	        break;
	    case MENSAL:
	        $scope.gran = GRANULARIDADE_MES;
	        break;
	    case DIARIA:
	        $scope.gran = GRANULARIDADE_DIA;
	        break;
	    default:
	        $scope.gran = GRANULARIDADE_DIA;
		}
     $scope.update();

      
     
    };

		var ED_ROUT = "/edificio/" + edificioService.getEdificioId() + "/consumo";
		var CAIXA_ROUT = "/caixa/" + edificioService.getEdificioId() + "/consumo";
		var UFCG_ROUT = "/universidade/consumo";
		var params = {};
		var ROUTE;
		
		$scope.type = 'year';
		$scope.data = [{
			key: 'Consumo',
			values: [{
				x: 0,
				y: 0,
			}],
			area: true,
					}];

					self.inicialDate = new Date();
					self.finalDate = new Date();
  				self.isOpen = false;

	  $scope.reload = function(){
	  	params.inicio = self.inicialDate;
	  		  	params.fim = self.finalDate;

	  	$scope.update();


				updateText();
	  };

	  var updateText = function(){
	  	if ($scope.gran == 'month'){
	  		$scope.texto_granularidade= "Mensal";
	  	}else if ($scope.gran == 'year') {
	  		$scope.texto_granularidade= "Anual"
	  		
	  	}else if ($scope.gran == 'day') {
	  		$scope.texto_granularidade= "Diário"	
	  	}
	  };


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


		
		updateLook();

		/*nv.utils.windowResize(function () {
			chart.update()
					});*/

            var data = $scope.data;

            // Assign the SVG selction
            chartData = d3.select('#economyChart svg').datum(data);
            chartData.transition().duration(500).call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
        });


        var updateLook = function(){
        	updateText();
        	chart.yAxis
		.axisLabel('Consumo')
		.tickFormat(d3.format('.2f'));

		chart.xAxis
			.axisLabel('Período')
			.ticks(d3.time.dats, 1)
			.tickValues($scope.data[0]['ticks']);

           if ($scope.gran == 'year'){
						chart.xAxis
						.axisLabel('Período')
						.tickFormat(function (d) { return d3.time.format('%Y')(new Date(d)); })
						.ticks(d3.time.dats, 1)
						.tickValues($scope.data[0]['ticks']);

					}else if($scope.gran == 'day'){
						chart.xAxis
						.axisLabel('Período')
						.tickFormat(function (d) { return d3.time.format('%b %d')(new Date(d)); })
						.ticks(d3.time.dats, 1)
						.tickValues($scope.data[0]['ticks']);
					}
					else if($scope.gran == 'month'){
						chart.xAxis
						.tickFormat(function (d) { return d3.time.format('%b')(new Date(d)); })

					}
					else{
						chart.xAxis
						.axisLabel('Período')
						.tickFormat(function (d) { return d3.time.format('%b %d %y')(new Date(d)); })
						.ticks(d3.time.dats, 1);
		};
			if (chartData) chartData.datum($scope.data).transition().duration(500).call(chart);
            nv.utils.windowResize(chart.update);

        };




        $scope.update = function() {
        	params.granularidade= $scope.gran;
        	
        	$scope.loadData();
            var data = $scope.data;
            updateLook();
			if (chartData) chartData.datum(data).transition().duration(500).call(chart);

            // Update the SVG with the new data and call chart
            
        };
         d3.select("#update").on("click", $scope.update);

        
		

		$scope.loadData = function () {
			if (edificioService.isCaixa()) {
			ROUTE = CAIXA_ROUT;

			} 
			else if (edificioService.isUFCG()) {
			ROUTE = UFCG_ROUT;

			}	else {
			ROUTE = ED_ROUT;
			};

			$http.get(ROUTE, {params: params})
				.then(function (response, ev) {
					$scope.data = [{ key: 'Data', values: response.data, area: true, gran: $scope.gran, ticks: getTicks(response.data, $scope.gran) }];
					if (chart) updateLook();


				}, function () {
					$scope.data = "error in fetching data"; //return if error on fetch
				});
		};

		var load = function () {
			$scope.loadData();
		};


		var diasDaSemana = ['Domingo','Segunda','Terca','Quarta','Quinta','Sexta','Sábado'];
		var getTicks = function(xy,granularidade){
			ticks = [];
			if (granularidade == "year"){
				xy.forEach(function(x){
					ano = moment(x).year();
					if (ticks.indexOf(ano)==-1){
						ticks.push(x.x);
					}
				});
			}else if (granularidade == "day"){
				xy.forEach(function(x){
					dia = x.x;
					if (ticks.indexOf(dia)==-1){
						ticks.push(dia);
					}
				})

			}
			else {
				xy.forEach(function(x){
					if (ticks.indexOf(x.x)==-1){
						ticks.push(x.x);
					}

				})
			};

			return ticks;
		};

		$scope.setYear = function(){
			edificioService.setGranularidade('year');
			$scope.data[0]['gran'] = $scope.gran;
			$scope.data = $scope.data;
		};

		load();

	}]);