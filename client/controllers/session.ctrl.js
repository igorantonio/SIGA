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