angular.module('myApp')
    .controller('MapController', [ '$scope', function($scope) {
    angular.extend($scope, {
        center: {
            "lat": -7.214455941427701,
            "lon": -395.90871261099613,
            "zoom": 17
        }
    });
}]);