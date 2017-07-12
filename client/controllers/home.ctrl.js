angular.module('myApp')
    .controller('HomeController', [ '$mdDialog', function ($mdDialog) {

        var originatorEv;

        this.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

        this.redial = function() {
        };

        this.checkVoicemail = function() {
        };
    }]);