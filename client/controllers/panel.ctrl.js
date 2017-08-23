angular.module('myApp')
    .controller('PanelController',
    ['$scope', 'AuthService', '$mdDialog', '$location', '$http', 'edificioService', 'userService', '$q',
        function ($scope, AuthService, $mdDialog, $location, $http, edificioService, userService, $q) {

            var self = this;
            self.showEdificio = false;
            self.showUser = false;
            self.showVazamento = false;

            self.data = [];

            var user = AuthService.getUser();
            self.user_email = user.username;

            self.loadEdificios = function (ev) {
                self.showUser = false;
                self.showEdificio = true;
                self.showVazamento = false;

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
                self.showVazamento = false;

                $http.get("/userIndex")
                    .then(function (response, ev) {
                        self.data = response.data;
                    }, function () {
                        self.data = "error in fetching data"; //return if error on fetch
                    });
            };

            self.loadVazamentos = function (ev) {
                self.showUser = false;
                self.showEdificio = false;
                self.showVazamento = true;

                $http.get("/edificio")
                    .then(function (response, ev) {
                        self.data = response.data;
                    }, function () {
                        self.data = "error in fetching data"; //return if error on fetch
                    });
            };

            self.logoutDialog = function (ev) {
                self.showEdificio = false;
                self.showUser = true;
                self.showVazamento = false;

                var user = AuthService.getUser();

                $mdDialog.show({
                    templateUrl: '../views/logout.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen
                });
            };

            self.logout = function () {
                AuthService.logout()
                    .then(function () {
                        $location.path('/');
                    });

                self.close();
            };

            self.close = function () {
                $mdDialog.cancel();
            };

            self.updatePassword = function () {

                self.error = false;
                self.success = false;
                self.successMessage = "";
                self.errorMessage = "";
                $scope.disabled = true;
                var q = $q.defer();

                if (self.password === self.confirm_pass) {
                    $http.put('/userPassword',
                        { email: self.user_email, password: self.password })
                        .success(function (data, status) {
                            if (status == 200) {
                                self.successMessage = "Senha Atualizada!";
                                self.success = true;
                                self.showEditPass = false;
                                self.password = "";
                                self.confirm_pass = "";
                                q.resolve();
                            } else {
                                self.error = true;
                                self.errorMessage = "Tente novamente!"
                                q.reject();
                            }
                        })
                        .error(function (data) {
                            self.error = true;
                            self.errorMessage = "Tente novamente!"
                            q.reject();
                        });
                } else {
                    self.error = true;
                    self.errorMessage = "Senhas não coincidem!"
                    q.reject();
                }

                return q.promise;
            };

            self.newUserDialog = function (ev) {

                 var confirm = $mdDialog.confirm({
                    templateUrl: '../views/register-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen,
                    controller: "RegisterDialogController",
                    controllerAs: 'ctrl',
                  })
                  $mdDialog.show(confirm).then(function() {
                    console.log("confirmando......")
                    self.loadUsers();
                  });

            };

            self.deleteUser = function (ev, user) {
                userService.setUser(user);

                $mdDialog.show({
                    templateUrl: '../views/del-user.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen,
                    controller: ManageUserController,
                    controllerAs: 'ctrl'
                });

            };

            self.editEdificio = function (ev, edificio) {
                edificioService.setEdificio(edificio);
                edificioService.setNew(false);

                $mdDialog.show({
                    templateUrl: '../views/manage-edificio.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen,
                    controller: ManageEdificioController,
                    controllerAs: 'ctrl'
                });
            };

            self.deleteEdificio = function (ev, edificio) {
                edificioService.setEdificio(edificio);
                edificioService.setNew(false);

                $mdDialog.show({
                    templateUrl: '../views/del-edificio.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen,
                    controller: ManageEdificioController,
                    controllerAs: 'ctrl'
                });
            }

            self.newEdificio = function (ev) {
                var edInicial = {
                    nome: "", descricao: "", atividade: "",
                    caracteristicasFisicas: {
                        localizacao: { setor: "", bloco: "" },
                        area: 0, n_pavimentos: 0, ocupacaoMedia: 0,
                        n_baciasSanitarias: 0, n_torneiras: 0,
                        n_duchas: 0, n_chuveiros: 0, n_pias: 0,
                        volumeReservatorio: 0
                    }, geolocalizacao: {
                        latitude: 0,
                        longitude: 0
                    }, mediaEsperada: 0
                };

                edificioService.setEdificio(edInicial);
                edificioService.setNew(true);

                $mdDialog.show({
                    templateUrl: '../views/manage-edificio.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen,
                    controller: ManageEdificioController,
                    controllerAs: 'ctrl'
                });

                self.loadEdificios();
            };

            self.addVazamento = function (ev, edificio) {
                edificioService.setEdificio(edificio);
                edificioService.setNew(false);

                $mdDialog.show({
                    templateUrl: '../views/add-vazamento.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen
                });
            };

            function ManageUserController($scope, $http, $mdDialog, userService) {

                this.user = userService.getUser();

                this.deleteUser = function () {
                    // initial values
                    $scope.error = false;
                    $scope.disabled = true;

                    $http.delete('/userDelete/' + this.user.username)
                        .success(function () {
                            self.loadUsers();
                            $mdDialog.hide();
                        })
                        .error(function () {
                        });
                };
            };

            function ManageEdificioController($scope, $http, $mdDialog, edificioService) {

                this.edificio = edificioService.getEdificio();

                this.message = function () {
                    if (edificioService.isNew())
                        return "Novo edifício";
                    return "Editar edificio";
                };

                this.operation = function () {
                    if (edificioService.isNew())
                        this.registerEdificio();
                    if (!edificioService.isNew())
                        this.editEdificio();
                };

                this.deleteEdificio = function () {

                    $scope.error = false;
                    $scope.disabled = true;

                    $http.delete('/edificio/' + this.edificio._id)
                        .success(function () {
                            $mdDialog.hide();
                            self.loadEdificios();
                        })
                        .error(function () {
                        });
                };

                this.registerEdificio = function () {

                    $scope.error = false;
                    $scope.disabled = true;

                    $http.post('/edificio', this.edificio)
                        .success(function () {
                            $mdDialog.hide();
                            self.loadEdificios();
                        })
                        .error(function () {
                        });
                };

                this.editEdificio = function () {

                    // initial values
                    $scope.error = false;
                    $scope.disabled = true;

                    $http.put('/edificio/' + this.edificio._id, this.edificio)
                        .success(function () {
                            $mdDialog.hide();
                            self.loadEdificios();
                        })
                        .error(function () {
                        });
                };

                self.addVazamento = function () {

                    // initial values
                    $scope.error = false;
                    $scope.disabled = true;

                    $http.post('/edificio/' + this.edificio._id + '/vazamentos/new', { volume: this.volume, data: this.data })
                        .success(function () {
                            $mdDialog.hide();
                            self.loadEdificios();
                        })
                        .error(function () {
                        });
                };

            }

        }]);
