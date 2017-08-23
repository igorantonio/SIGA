angular.module('myApp')
    .service('contasService', function () {

        var self = this;

        var isNew = false;
        var conta = {};

        self.getConta = function () {
            return conta;
        };

        self.setConta = function (c) {
            conta = c;
        };

        self.isNew = function(){
            return isNew;
        };

        self.setIsNew = function(bool){
            isNew = bool;
        };

    });