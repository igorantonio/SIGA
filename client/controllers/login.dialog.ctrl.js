angular.module('myApp')
    .controller('LoginDialogController', ['$location', 'AuthService', '$mdDialog',
        function ($location, AuthService, $mdDialog) {

        var self = this;

            self.hide = function() {
                $mdDialog.hide();
            };

            self.close = function() {
                $mdDialog.cancel();
            };

            self.answer = function(answer) {
                $mdDialog.hide(answer);
            };

            self.login = function () {

                // initial values
                self.error = false;
                self.disabled = true;

                // call login from service
                AuthService.login(self.username, self.password)

                // handle success
                    .then(function () {
                        $location.path('/');
                        self.disabled = false;
                        self.loginForm = {};
                        self.close();
                    })
                    // handle error
                    .catch(function () {
                        self.error = true;
                        self.errorMessage = "Invalid username and/or password";
                        self.disabled = false;
                        self.loginForm = {};
                    });

            };

        }]);