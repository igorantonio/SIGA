angular.module('myApp')
    .controller('MapController', ['$scope', 'olData', function($scope, olData) {

        var self = this;

        $scope.oi= 'sem id por hr';
        self.oi ="";

        angular.extend($scope, {
            center: {
                "lat": -7.214455941427701,
                "lon": -395.90871261099613,
                "zoom": 17
            },
            layers: [
                {
                    name: 'geojson',
                    source: {
                        type: 'GeoJSON',
                        url: 'lib/json/all.geo.json'
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
                }
            ],
            defaults: {
                events: {
                    layers: [ 'click' ]
                },
                controls: {
                    zoom: true,
                    rotate: true,
                    attribution: true
                },
                interactions: {
                    mouseWheelZoom: true
                }
            }
        });

        $scope.$on('openlayers.layers.geojson.click', function(event, feature) {
            $scope.$apply(function(scope) {
                if(feature) {
                    $scope.id = feature.getId();
                } else {
                    $scope.id = 'deu ruim';
                }
            });
        });

}]);