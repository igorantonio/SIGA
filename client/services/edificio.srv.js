angular.module('myApp')
  .service('edificioService', function() {
    var edificioId = {};
    var isCaixa = false;
    this.getEdificioId = function(){
      return edificioId;
    };
    this.setEdificioId = function(id){
      edificioId = id;
    };
    this.setCaixa = function(b){
    	isCaixa = b;
    };
    this.isCaixa = function(){
    	return isCaixa;
    }

});