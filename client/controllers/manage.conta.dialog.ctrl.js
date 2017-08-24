angular.module('myApp')
    .controller('ManageContaDialogController', ['$scope', '$http', '$mdDialog', 'contasService',
        function ($scope, $http, $mdDialog, contasService) {

            var self = this;
            self.conta = contasService.getConta();

            console.log(typeof(self.conta.dataDePagamento));

            self.close = function () {
                $mdDialog.cancel();
            };

            self.operation = function () {
                if (contasService.isNew()) {
                    self.addConta();
                } else {
                    self.editConta();
                }
            };

            self.mdDialogSubmit = function () {
                $mdDialog.hide();
            };

            self.addConta = function () {

                $scope.error = false;
                $scope.disabled = true;

                $http.post('/universidade/contaDeAgua/', self.conta)
                    .success(function () {
                        self.mdDialogSubmit();
                    })
                    .error(function () {
                    });
            };

            self.editConta = function () {

                $scope.error = false;
                $scope.disabled = true;

                $http.put('/universidade/contaDeAgua/' + self.conta._id, self.conta)
                    .success(function () {
                        self.mdDialogSubmit();
                    })
                    .error(function () {
                    });
            };

            self.deleteConta = function () {

                $scope.error = false;
                $scope.disabled = true;

                $http.delete('/universidade/contaDeAgua/' + self.conta._id)
                    .success(function () {
                        console.log(self.conta);
                        self.mdDialogSubmit();
                    })
                    .error(function () {
                    });
            };
        }]);
