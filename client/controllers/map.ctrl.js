angular.module('myApp')
    .controller('MapController', ['$scope', 'GeoService', function($scope, GeoService) {

        var self = this;

        self.geojsons = GeoService.getEdificiosJson();

        angular.extend($scope, {
        center: {
            "lat": -7.214455941427701,
            "lon": -395.90871261099613,
            "zoom": 17
        }
    });

}]);