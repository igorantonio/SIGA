angular.module('myApp')
    .controller('SessionController', ['$scope', '$location', 'AuthService', '$mdDialog',
        function ($scope, $location, AuthService, $mdDialog) {

            $scope.login = function () {

                // initial values
                $scope.error = false;
                $scope.disabled = true;

                // call login from service
                AuthService.login($scope.loginForm.username, $scope.loginForm.password)
                // handle success
                    .then(function () {
                        $location.path('/');
                        $scope.disabled = false;
                        $scope.loginForm = {};
                    })
                    // handle error
                    .catch(function () {
                        $scope.error = true;
                        $scope.errorMessage = "Invalid username and/or password";
                        $scope.disabled = false;
                        $scope.loginForm = {};
                    });

            };

            $scope.logout = function () {

                // call logout from service
                AuthService.logout()
                    .then(function () {
                        $location.path('/login');
                    });

            };

            $scope.logoutD = function (ev) {

                var isLogged = AuthService.isLoggedIn();

                if (isLogged) {

                    var confirm = $mdDialog.confirm()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Você está logado. Deseja deslogar?')
                        .targetEvent(ev)
                        .ok('Deslogar');

                    $mdDialog.show(confirm).then(function() {
                        $scope.logout();
                    });

                } else {

                    var confirm = $mdDialog.prompt()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Deseja se logar?')
                        .textContent('Insira e-mail e senha.')
                        .placeholder('E-mail')
                        .targetEvent(ev)
                        .ok('Logar');

                    $mdDialog.show(confirm).then(function(result) {
                        $scope.status = 'You decided to name your dog ' + result + '.';
                    }, function() {
                        $scope.status = 'You didn\'t name your dog.';
                    });

                }

            };

        }]);