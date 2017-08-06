angular.module('myApp')
    .controller('SessionController', ['$scope', '$location', 'AuthService', '$mdDialog',
        function ($scope, $location, AuthService, $mdDialog) {

            var self = this;

            self.changeSessionState = function (ev) {
                var isLogged = AuthService.isLoggedIn();

                if (isLogged) {
                    self.panel(ev);
                } else {
                    self.login(ev);
                }
            };

            self.panel = function (ev){
                $location.path('/panel');
            };

            self.logout = function (ev) {
                var user = AuthService.getUser();

                var confirm = $mdDialog.confirm()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title(user.username + ' você está logado. Deseja deslogar?')
                    .targetEvent(ev)
                    .ok('Deslogar');

                $mdDialog.show(confirm).then(function () {
                    AuthService.logout()
                        .then(function () {
                            $location.path('/');
                        });
                });
            };

            self.login = function (ev) {

                $mdDialog.show({
                    templateUrl: '../views/login-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen
                })
            };

    }]);