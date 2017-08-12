angular.module('myApp')
  .service('edificioService', function() {
    
    var edificioId = {};
    var isCaixa = false;
    var UFCG_ID = 0;

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
    };

    this.setIsUFCG = function(flag) {
     isUFCG = flag; 
    };

    this.isUFCG = function() {
      return edificioId == UFCG_ID;
    };

});