angular
    .module('myApp')
    .directive('navbar', function () {
        return {
            templateUrl: 'views/navbar.html',
            restrict: 'E'
        }
    });
