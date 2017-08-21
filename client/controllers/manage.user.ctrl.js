angular.module('myApp')
    .controller('ManageUserController', ['$scope', '$http', '$mdDialog', 'userService',
        function ($scope, $http, $mdDialog, userService) {

            var self = this;
            self.user = userService.getUser();

            self.close = function () {
                $mdDialog.cancel();
            };

            self.deleteUser = function(){
                // initial values
                $scope.error = false;
                $scope.disabled = true;

                $http.delete('/deleteUser', {self.user.username})
                    .success(function(){
                        self.close();
                        console.log('muito bom');
                    })
                    .error(function(){
                        console.log('muito ruim');
                    });
            };
}]);
