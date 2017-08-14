angular.module('myApp')
    .controller('RegisterEdificioController', ['$scope', '$http',
        function ($scope, $http) {

            var self = this;

            self.close = function () {
                $mdDialog.cancel();
            };

            self.registerEdificio = function() {
                $http.post('/edificio', {})
                    .success(function(){
                        console.log('muito bom');
                    })
                    .error(function(){
                        console.log('parabains');
                    });
            };

}]);