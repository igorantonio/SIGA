angular.module('myApp')
    .controller('ModalController', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
        $scope.status = '  ';
        $scope.customFullscreen = false;

        $scope.showTabDialog = function (ev) {
            $mdDialog.show({
                templateUrl: '../views/modal.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        };

    }]);


angular.module('myApp')
    .controller('DialogController', ['$scope','$mdDialog', '$q', '$http',
        function ($scope, $mdDialog, $q, $http) {

            var self = this;

            $scope.showInfos = false;

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };

            function getEstatisticas() {
                var q = $q.defer();
                var route = "/estatistica/edificio/" + $scope.edificio._id;
                
                self.pontoDeConsumo = $scope.edificio;

                $http.get(route).then(function(info) {
                    q.resolve(info.data);
                    self.estatisticas = info.data;
                }, function(info){
                    console.log('Rota errada')
                });

                return q.promise;
            }

            var init = function () {
                getEstatisticas();
            };

            init();
        }]);