angular.module('myApp')
    .controller('ManageContaDialogController', ['$scope', '$http', '$mdDialog',
        function ($scope, $http, $mdDialog) {

            var self = this;

            self.close = function () {
                $mdDialog.cancel();
            };
            
            self.mdDialogSubmit = function () {
                $mdDialog.hide();
            };

            self.registrarAlteracao = function() {

                $scope.error = false;
                $scope.disabled = true;

                var conta = {valor: self.valor, mes: self.mes, dataDePagamento: self.data};

                $http.post('/universidade/contaDeAgua', conta)
                    .success(function(){
                        self.mdDialogSubmit();
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
                        console.log('muito bom');
                    })
                    .error(function(){
                        console.log('muito ruim');
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
