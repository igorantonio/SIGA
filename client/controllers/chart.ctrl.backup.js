angular.module('myApp')
    .controller('ChartController', ['$scope', 'edificioService', '$http', function ($scope, edificioService, $http) {
         var chart;
          var chartData;
        nv.addGraph(function() {
            chart = nv.models.lineChart().margin({
                    top: 5,
                    right: 10,
                    bottom: 38,
                    left: 10
                }).color(["lightgrey", "rgba(242,94,34,0.58)"])
                .useInteractiveGuideline(false)
                //.transitionDuration(350)
                .showLegend(true).showYAxis(false)
                .showXAxis(true).forceY([0.4, 1.6]);

            chart.xAxis.tickFormat(d3.format('d')).axisLabel("Rounds");
            chart.yAxis.tickFormat(d3.format('0.1f'));

            var data = economyData();

            // Assign the SVG selction
            chartData = d3.select('#economyChart svg').datum(data);
            chartData.transition().duration(500).call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
        });


        $scope.update = function() {
            $scope.type= 'year';
            var data = economyData();

            // Update the SVG with the new data and call chart
            chartData.datum(data).transition().duration(500).call(chart);
            nv.utils.windowResize(chart.update);
        };
         d3.select("#update").on("click", $scope.update);

        var x = function() {
            d3.select("#update").on("click", $scope.update);

        };



        // Data Calc
        var economyData = function() {
            // Your economyData code
            // ....
            var numRounds = 10;

            // Stability of economy
            var stable = 0.2,
                unstable = 0.6;
            var stability = unstable;

            // Type of economy
            var boom = 0.02,
                flat = 0,
                poor = -0.02,
                economyTrend = boom;

            // Range
            var start = 1,
                max = start + stability,
                min = start - stability;

            // Arrays
            var baseLine = [],
                economy = [];

            // Loop
            for (var i = 0; i < numRounds + 1; i++) {

                baseLine.push({
                    x: i,
                    y: 1
                });

                if (i == 0) {
                    economyValue = 1;
                } else {
                    var curve = Math.min(Math.max(start + ((Math.random() - 0.5) * stability), min), max);
                    economyValue = Math.round(((1 + (economyTrend * i)) * curve) * 100) / 100;
                }

                economy.push({
                    x: i,
                    y: economyValue
                });
            }

            return [{
                key: 'Base Line',
                values: baseLine
            }, {
                key: 'Economy',
                values: economy
            }];
        };



        
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

            }   else {
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

        $scope.setYear = function(){
            console.log("YEHOUW");
            edificioService.setGranularidade('year');
            $scope.data[0]['gran'] = $scope.gran;
            $scope.data = $scope.data;
        };

        load();

    }]);