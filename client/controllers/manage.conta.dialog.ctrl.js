angular.module('myApp')
    .controller('ManageContaDialogController', ['$scope', '$http', '$mdDialog', 'contasService',
        function ($scope, $http, $mdDialog, contasService) {

            var self = this;
            self.conta = contasService.getConta();

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

            self.deleteConta = function(){

                $scope.error = false;
                $scope.disabled = true;

                $http.delete('/universidade/contaDeAgua/' + self.conta._id)
                    .success(function(){
                        console.log(self.conta);
                        self.mdDialogSubmit();
                    })
                    .error(function(){
                    });
            };
}]);
