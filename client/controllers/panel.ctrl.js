angular.module('myApp')
	.controller('PanelController', ['$scope', 'AuthService', '$mdDialog', '$location', '$http', 'edificioService',
	 function($scope, AuthService, $mdDialog, $location, $http, edificioService) {

	 	var self = this;
	 	self.showEdificio = false;
	 	self.showUser = false;
	 	self.data = [];

        self.loadEdificios = function(ev) {
            self.showUser = false;
            self.showEdificio = true;

            $http.get("/edificio")
            .then(function(response, ev) {
                self.data = response.data;		            
            }, function() {
                self.data = "error in fetching data"; //return if error on fetch
            });
        };        

        self.loadUsers = function(ev) {
            self.showUser = true;
            self.showEdificio = false;

            var user = AuthService.getUser();
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

        self.editEdificio = function(ev, edificio) {
            edificioService.setEdificio(edificio);
            edificioService.setNew(false);

		    $mdDialog.show({
              templateUrl: '../views/manage-edificio.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose: true,
              fullscreen: $scope.customFullscreen
          });
		};

        self.newEdificio = function(ev) {
            var edInicial = {nome: "", descricao: "", atividade: "",
                    caracteristicasFisicas: {localizacao: {setor: "", bloco: ""}, 
                    area: 0, n_pavimentos: 0, ocupacaoMedia: 0,
                    n_baciasSanitarias: 0, n_torneiras: 0, 
                    n_duchas: 0, n_chuveiros: 0, n_pias: 0, 
                    volumeReservatorio: 0}, geolocalizacao: {latitude: 0, 
                    longitude: 0}, mediaEsperada: 0};

            edificioService.setEdificio(edInicial);
            edificioService.setNew(true);

            $mdDialog.show({
              templateUrl: '../views/manage-edificio.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose: true,
              fullscreen: $scope.customFullscreen
            });
        };

        self.newUserDialog = function(ev) {
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
