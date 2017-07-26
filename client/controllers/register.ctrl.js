angular.module('myApp')
    .controller('registerController', ['$scope', '$location', 'AuthService', '$mdDialog',
        function ($scope, $location, AuthService, $mdDialog) {

            var self = this;

            $scope.register = function () {

                // initial values
                $scope.error = false;
                $scope.disabled = true;

                // call register from service
                AuthService.register($scope.registerForm.username, $scope.registerForm.password)
                // handle success
                    .then(function () {
                        $location.path('/');
                        $scope.disabled = false;
                        $scope.registerForm = {};
                    })
                    // handle error
                    .catch(function () {
                        $scope.error = true;
                        $scope.errorMessage = "Something went wrong!";
                        $scope.disabled = false;
                        $scope.registerForm = {};
                    });

            };

            self.isLoggedIn = function () {
                return AuthService.isLoggedIn();
            };
            
            self.showRegisterDialog = function (ev) {

                $mdDialog.show({
                    templateUrl: '../views/register-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen
                })

            }

        }]);