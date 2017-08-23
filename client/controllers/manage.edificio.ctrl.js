angular.module('myApp')
    .controller('ManageEdificioController', ['$scope', '$http', '$mdDialog', 'edificioService',
        function ($scope, $http, $mdDialog, edificioService) {

            var self = this;
            self.edificio = edificioService.getEdificio();

            self.message = function(){
                if(edificioService.isNew())
                    return "Novo edifício";
                return "Editar edificio";
            };

            self.operation = function() {
                if(edificioService.isNew())
                    self.registerEdificio();
                if(!edificioService.isNew())
                    self.editEdificio();
            };

            self.close = function () {
                $mdDialog.hide();
            };

            self.registerEdificio = function() {

                // initial values
                $scope.error = false;
                $scope.disabled = true;

                $http.post('/edificio', self.edificio)
                    .success(function(){
                        self.close();
                    })
                    .error(function(){
                    });
            };

            self.editEdificio = function() {

                // initial values
                $scope.error = false;
                $scope.disabled = true;

                $http.put('/edificio/' + self.edificio._id, self.edificio)
                    .success(function(){
                        self.close();
                    })
                    .error(function(){
                    });
            };

            self.deleteEdificio = function(){

                $scope.error = false;
                $scope.disabled = true;

                $http.delete('/edificio/' + self.edificio._id)
                    .success(function(){
                        self.close();
                    })
                    .error(function(){
                    });
            };

            self.addVazamento = function() {

                // initial values
                $scope.error = false;
                $scope.disabled = true;

                $http.post('/edificio/' + self.edificio._id + '/vazamentos/new', {volume: self.volume, data: self.data})
                    .success(function(){
                        self.close();
                        console.log('muito bom');
                    })
                    .error(function(){
                        console.log('muito ruim');
                    });
            };
}]);
