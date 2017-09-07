angular.module('myApp')
    .controller('LoginDialogController', ['$location', 'AuthService', '$mdDialog',
        function ($location, AuthService, $mdDialog) {

            var self = this;

            self.close = function () {
                $mdDialog.cancel();
            };

            self.login = function () {

                // initial values
                self.error = false;

                // call login from service
                AuthService.login(self.username, self.password)

                    // handle success
                    .then(function () {
                        $location.path('/');
                        self.close();
                    })
                    // handle error
                    .catch(function () {
                        self.error = true;
                        self.errorMessage = "Usuário ou senha inválidos!";
                    });
            };

        }]);