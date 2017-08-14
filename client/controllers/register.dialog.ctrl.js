angular.module('myApp')
    .controller('RegisterDialogController', ['$scope', '$location', 'AuthService', '$mdDialog',
        function ($scope, $location, AuthService, $mdDialog) {

            var self = this;

            self.close = function () {
                $mdDialog.cancel();
            };

            self.register = function () {

                // initial values
                $scope.error = false;
                $scope.disabled = true;

                // call register from service
                AuthService.register(self.username, self.password)
                // handle success
                    .then(function () {
                        $location.path('/');
                        self.disabled = false;
                        self.registerForm = {};
                        self.close();
                    })
                    // handle error
                    .catch(function () {
                        self.error = true;
                        self.errorMessage = "Something went wrong!";
                        self.disabled = false;
                        self.registerForm = {};
                    });
            };

        }]);