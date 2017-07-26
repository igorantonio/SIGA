angular
    .module('myApp')
    .directive('myfooter', function () {
        return {
            templateUrl: 'views/footer.html',
            restrict: 'E'
        }
    });
