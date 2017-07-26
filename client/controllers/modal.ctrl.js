angular.module('myApp')
    .controller('ModalController', [ '$scope', '$mdDialog', function($scope, $mdDialog) {
    $scope.status = '  ';
    $scope.customFullscreen = false;

	$scope.showTabDialog = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: './views/modal.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
  };

  function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  }
}]);