angular.module('myApp')
    .controller('ChartController', ['$scope', 'edificioService', function($scope, edificioService) {
     $scope.type = "mensal";
     $scope.consumo = edificioService.getConsumo();

    $scope.loadData = function () {
    	$http.get("/edificio/" + $scope.edificioId + "/consumo")
    		.then(function(response, ev){
    			$scope.data = response;
    			console.log($scope.data);
        });
    };

    $scope.loadData();

    //Change dia and consumo in data to x and y, respectively
    var str = JSON.stringify($scope.data);
    str = str.replace("\"dia\":", "\"y\":");
    str = str.replace("\"consumo\":", "\"x\":");
    $scope.data = JSON.parse(str);

	this.data = [{
		key: 'Consumo',
	    values: $scope.data,
	    area: true
	  }];
	}])

	.factory('d3', [function() {
	  return d3;
	}])

	.factory('nv', [function() {
	  return nv;
	}])

	.directive('lineChart', ['d3', 'nv', function(d3, nv) {
	  return {
	    restrict: 'E',
	    scope: {
	      data: '=',
	      height: '@',
	      width: '@'
	    },
	    template: '<svg ng-attr-height="{{ height }}" ng-attr-width="{{ width }}"></svg>',
	    link: function(scope, element) {

		    var svg = element.find('svg'),
		      chart;
		    
		    var update = function() {
		      d3.select(svg[0])
		        .datum(scope.data)
		        .call(chart);
		    };
		      
		    scope.$watch(function() { return angular.toJson(scope.data); }, function() {
		      if (chart) {
		        update();
		      }
		    });
		      
		    scope.$on('chartloaded', update);
		    
		    nv.addGraph(function() {
		      	chart = nv.models.lineChart()
		        	.showLegend(true)
		        	.showYAxis(true)
		        	.showXAxis(true);

		    	chart.xAxis
		          .axisLabel('Período');

		        chart.yAxis
		          .axisLabel('Litros')
		          /*.tickFormat(d3.format('.2f'))*/;

		        nv.utils.windowResize(function() {
		          chart.update()
		        });

		        scope.$emit('chartloaded');
		        
		       	return chart;
	      	});
	    }
	  }
}]);