angular.module('myApp')
    .controller('ChartController', ['$scope', function($scope) {
     $scope.type = "mensal";

	  this.data = [{
	    key: 'Consumo',
	    values: [{
	      x: 0,
	      y: 0,
	    }, {
	      x: 1,
	      y: 1
	    }, {
	      x: 2,
	      y: 4
	    }, {
	      x: 3,
	      y: 9
	    }, {
	      x: 4,
	      y: 16
	    }, {
	      x: 5,
	      y: 25
	    }],
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
		          .axisLabel('Período')
		          .tickFormat(d3.format('.2f'));

		        chart.yAxis
		          .axisLabel('Litros')
		          .tickFormat(d3.format('.2f'));

		        nv.utils.windowResize(function() {
		          chart.update()
		        });

		        scope.$emit('chartloaded');
		        
		       	return chart;
	      	});
	    }
	  }
}]);