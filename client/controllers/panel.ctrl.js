angular.module('myApp')
	.controller('PanelController', ['$scope', 'AuthService', '$mdDialog', '$location', '$http',
	 function($scope, AuthService, $mdDialog, $location, $http) {

	 	var self = this;
	 	self.showEdificio = false;
	 	self.showUser = false;
	 	self.data = [];

        self.loadEdificios = function(ev) {
        	self.showUser = false;
        	self.showEdificio = true;

        	$http.get("/edificio")
		        .then(function(response, ev){
		        	self.data = response.data;		            
		        }, function() {
		        	self.data = "error in fetching data"; //return if error on fetch
		    });
        };        

        self.loadUsers = function(ev) {
        	var user = AuthService.getUser();
        	console.log(user);
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

        self.editEdificio = function(event) {
		    $mdDialog.show(
		      $mdDialog.alert()
		        .title('Secondary Action')
		        .textContent('Secondary actions can be used for one click actions')
		        .ariaLabel('Secondary click demo')
		        .ok('Neat!')
		        .targetEvent(event)
		  );
		};
}]);