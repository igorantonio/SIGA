angular.module('myApp')
    .controller('SessionController', ['$scope', '$location', 'AuthService', '$mdDialog',
        function ($scope, $location, AuthService, $mdDialog) {


            $scope.logout = function (ev) {

                var isLogged = AuthService.isLoggedIn();

                if (isLogged) {

                    var confirm = $mdDialog.confirm()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Você está logado. Deseja deslogar?')
                        .targetEvent(ev)
                        .ok('Deslogar');

                    $mdDialog.show(confirm).then(function () {

                        // call logout from service
                        AuthService.logout()
                            .then(function () {
                                $location.path('/');
                            });

                    });
                }
            };

            $scope.openDialog = function (ev) {
                $mdDialog.show({
                    templateUrl: '../views/login-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                    .then(function (answer) {
                        $scope.status = 'You said the information was "' + answer + '".';
                    }, function () {
                        $scope.status = 'You cancelled the dialog.';
                    });
            };

        }]);