angular.module('myApp')
    .controller('MapController', ['$scope', 'GeoService', 'olData', function($scope, GeoService, olData) {

        var self = this;

        self.geojsons = GeoService.getEdificiosJson();

        angular.extend($scope, {
            center: {
                "lat": -7.214455941427701,
                "lon": -395.90871261099613,
                "zoom": 17
            },
            layers: self.geojsons,
            defaults: {
                events: {
                    map: [ 'singleclick', 'pointermove' ],
                    layers: ['mousemove', 'singleclick']
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

        olData.getMap().then(function(map) {
            $scope.$on('openlayers.layers.singleclick', function(event, feature) {
                console.log(event);
            });
        });

        $scope.$on('openlayers.layers.mousemove', function(event, feature) {
            console.log('oi')
        });

}]);