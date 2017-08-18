angular.module('myApp')
    .controller('PanelController', ['$scope', 'AuthService', '$mdDialog', '$location', '$http', '$q',
        function ($scope, AuthService, $mdDialog, $location, $http, $q) {

            var self = this;
            self.showEdificio = false;
            self.showUser = false;
            self.showEditPass = false;
            self.data = [];

            var user = AuthService.getUser();
            self.user_email = user.username;

            self.loadEdificios = function (ev) {
                self.showUser = false;
                self.showEdificio = true;

                $http.get("/edificio")
                    .then(function (response, ev) {
                        self.data = response.data;
                    }, function () {
                        self.data = "error in fetching data"; //return if error on fetch
                    });
            };

            self.loadUsers = function (ev) {
                self.showUser = true;
                self.showEdificio = false;
            };

            self.logout = function (ev) {
                self.showEdificio = false;
                self.showUser = true;

                var user = AuthService.getUser();

                var confirm = $mdDialog.confirm()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title(user.username + ', você está logado. Deseja deslogar?')
                    .targetEvent(ev)
                    .ok('Deslogar');

                $mdDialog.show(confirm).then(function () {
                    AuthService.logout()
                        .then(function () {
                            $location.path('/');
                        });
                });
            };

            self.editEdificio = function (event) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .title('Secondary Action')
                        .textContent('Secondary actions can be used for one click actions')
                        .ariaLabel('Secondary click demo')
                        .ok('Neat!')
                        .targetEvent(event)
                );
            };

            self.newEdificio = function (ev) {
                $mdDialog.show({
                    templateUrl: '../views/new-edificio.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen
                });
            };

            self.updatePassword = function () {

                $scope.error = false;
                $scope.disabled = true;
                var deferred = $q.defer();

                if (self.password === self.confirm_pass) {
                    $http.post('/userPassword',
                        { email: self.user_email , password: self.password })
                        .success(function (data, status) {
                            if (status === 200 && data.status) {
                                deferred.resolve();
                            } else {
                                deferred.reject();
                            }
                        })
                        .error(function (data) {
                            deferred.reject();
                        });
                } else {
                    deferred.reject();
                }

                return deferred.promise;
            };

            self.newUserDialog = function (ev) {
                self.loadUsers();
                $mdDialog.show({
                    templateUrl: '../views/register-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen,
                    controller: "RegisterDialogController",
                    controllerAs: 'ctrl'
                });
            };
        }]);
