angular
    .module('myApp')
    .directive('toolbar', function () {
        return {
            templateUrl: 'views/toolbar.html',
            restrict: 'E'
        }
    });
