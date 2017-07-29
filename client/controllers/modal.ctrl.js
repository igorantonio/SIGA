angular.module('myApp')
    .controller('ModalController', ['$scope', '$mdDialog', '$mdBottomSheet', function ($scope, $mdDialog, $mdBottomSheet) {
        $scope.status = '  ';
        $scope.customFullscreen = false;

        $scope.showTabDialog = function (ev) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: './views/modal.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        };
    }]);


angular.module('myApp')
    .controller('DialogController', ['$scope', '$mdDialog', '$mdBottomSheet',
        function ($scope, $mdDialog, $mdBottomSheet) {

            var self = this;

            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };

            $scope.showListBottomSheet = function(ev) {
                $mdBottomSheet.show({
                    controller: DialogController,
                    templateUrl: '../views/info.predio.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    targetEvent: ev,
                }).then(function(clickedItem) {
                    console.log("HIIIIIIIIIIIIIII")
                }).catch(function(error) {
                });
            };

        }]);