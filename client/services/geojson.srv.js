angular.module('myApp')
    .service("GeoService", function () {

        var self = this;

        var indexs = ['ginasio', 'reitoria'];

        self.geojsons = [];

        function init() {

            for (var i = 0; i < indexs.length; i++) {

                var path = "services/json/" +  indexs[i] + ".geo.json";

                var layer = {
                    source: {
                        type: 'GeoJSON',
                        url: path
                    },
                    style: {
                        fill: {
                            color: '#5E7ED2'
                        },
                        stroke: {
                            color: 'white',
                            width: 1
                        }
                    }
                };

                self.geojsons.push(layer);
            }
        }

        self.getEdificiosJson = function () {
            init();
            return self.geojsons;
        };

    });

