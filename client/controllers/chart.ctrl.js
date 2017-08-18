angular.module('myApp')
	.controller('ChartController', ['$scope', 'edificioService', '$http', function ($scope, edificioService, $http) {
		
		$scope.type = 'detalhado';
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
			area: true
		}];

		var ED_ROUT = "/edificio/" + edificioService.getEdificioId() + "/consumo";
		var CAIXA_ROUT = "/caixa/" + edificioService.getEdificioId() + "/consumo";
		var UFCG_ROUT = "/universidade/consumo";
		var ROUTE;

		

		$scope.loadData = function () {
			console.log('aqui',edificioService.isCaixa());
			if (edificioService.isCaixa()) {
			ROUTE = CAIXA_ROUT;

			} 
			else if (edificioService.isUFCG()) {
			ROUTE = UFCG_ROUT;

			}	else {
			ROUTE = ED_ROUT;
			};

			$http.get(ROUTE)
				.then(function (response, ev) {
					$scope.data = [{ key: 'Data', values: response.data, area: true }];

				}, function () {
					$scope.data = "error in fetching data"; //return if error on fetch
				});
		};

		var load = function () {
			$scope.loadData();
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
				data: '=',
				height: '@',
				width: '@'
			},
			template: '<svg ng-attr-height="{{ height }}" ng-attr-width="{{ width }}"></svg>',
			link: function (scope, element) {
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


					chart.xAxis
						.axisLabel('data')
						.tickFormat(function (d) { return d3.time.format('%b %d %y')(new Date(d)); })
						.ticks(d3.time.dats, 1);

					chart.yAxis
						.axisLabel('y')
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