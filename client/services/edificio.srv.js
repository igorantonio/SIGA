angular.module('myApp')
  .service('edificioService', function() {
    var edificioId = {};
    this.getEdificioId = function(){
      return edificioId;
    };
    this.setEdificioId = function(id){
      edificioId = id;
    }

});