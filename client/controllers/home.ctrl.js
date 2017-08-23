angular.module('myApp')
    .controller('HomeController', [ '$mdDialog', '$location', function ($mdDialog, $location) {

        var originatorEv;

        this.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

        this.goToHome = function() {
            $location.path('/');
        };

        this.redial = function() {
        };

        this.checkVoicemail = function() {
        };
    }]);