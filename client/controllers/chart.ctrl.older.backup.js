angular.module('myApp')
	.controller('ChartController', ['$scope', 'edificioService', '$http', 'd3', function ($scope, edificioService, $http, d3) {
		
		$scope.type = 'year';
		$scope.gran = edificioService.getGranularidade();
		$scope.data = [{
			key: 'Data',
			values: [{
				x: 0,
				y: 0,
			}, {
				x: 1,
				y: 0
			}, {
				x: 2,
				y: 0
			}, {
				x: 3,
				y: 0
			}, {
				x: 4,
				y: 0
			}, {
				x: 5,
				y: 0
			}],
			area: true,
			gran: 'year',
		}];

		var ED_ROUT = "/edificio/" + edificioService.getEdificioId() + "/consumo";
		var CAIXA_ROUT = "/caixa/" + edificioService.getEdificioId() + "/consumo";
		var UFCG_ROUT = "/universidade/consumo";
		var ROUTE;

		

		$scope.loadData = function () {
			if (edificioService.isCaixa()) {
			ROUTE = CAIXA_ROUT;

			} 
			else if (edificioService.isUFCG()) {
			ROUTE = UFCG_ROUT;

			}	else {
			ROUTE = ED_ROUT;
			};

			$http.get(ROUTE, {params: {granularidade: $scope.gran}})
				.then(function (response, ev) {
					$scope.data = [{ key: 'Data', values: response.data, area: true, gran: $scope.gran, ticks: getTicks(response.data, $scope.gran) }];

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
				xy.forEach(function(x,y){
					ano = moment(x).year();
					if (ticks.indexOf(ano)==-1){
						ticks.push(ano);
					}
				});
			}else if (granularidade == "day"){
				xy.forEach(function(x){
					dia = x.x;
					if (ticks.indexOf(dia)==-1){
						ticks.push(dia);
					}
				})

			};

			return ticks;
		};

		load();

	}])

	.factory('d3', [function () {
		return d3;
	}])

	.factory('nv', [function () {
		return nv;
	}])

	.directive('lineChart', ['d3', 'nv', function (d3, nv) {
		return {
			restrict: 'E',
			scope: {
				gran: '=',
				data: '=',
				height: '@',
				width: '@',
			},
			template: '<svg ng-attr-height="{{ height }}" ng-attr-width="{{ width }}"></svg>',
			link: function (scope, element, ) {

				var svg = element.find('svg'),
					chart;

				var update = function () {
					d3.select(svg[0])
						.datum(scope.data)
						.call(chart);
				};

				scope.$watch(function () { return angular.toJson(scope.data); }, function () {
					if (chart) {
						update();
					}
				});


				scope.$on('chartloaded', update);

				nv.addGraph(function () {
					chart = nv.models.lineChart()
						.showLegend(false)
						.showYAxis(true)
						.showXAxis(true);
					//chart.x(function(d){return new Date(d)});
					//chart.lines.xScale(d3.time.scale.utc());
					chart.xScale(d3.time.scale());
					if (scope.data[0]['gran'] == 'year'){
						chart.xAxis
						.axisLabel('Período')
						.tickFormat(function (d) { return d3.time.format('%Y')(new Date(d)); })
						.ticks(d3.time.dats, 1)
						.tickValues(scope.data[0]['ticks']);

					}else if(scope.data[0]['gran'] == 'day'){
						chart.xAxis
						.axisLabel('Período')
						.tickFormat(function (d) { return d3.time.format('%b %d')(new Date(d)); })
						.ticks(d3.time.dats, 1)
						.tickValues(scope.data[0]['ticks']);
					}
					else{
						chart.xAxis
						.axisLabel('Período')
						.tickFormat(function (d) { return d3.time.format('%b %d %y')(new Date(d)); })
						.ticks(d3.time.dats, 1);

					};
					

					
					chart.yAxis
						.axisLabel('Consumo')
						.tickFormat(d3.format('.2f'));

					nv.utils.windowResize(function () {
						chart.update()
					});

					scope.$emit('chartloaded');

					return chart;
				});
			}
		}
	}]);