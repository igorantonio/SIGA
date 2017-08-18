angular.module('myApp')
  .service('edificioService', function() {
  	var isNew = false;
  	var edificio = {};
    var edificioId = {};
    this.getEdificio = function(){
      return edificio;
    };
    this.setEdificio = function(ed){
      edificio = ed;
    }
    this.getEdificioId = function(){
      return edificioId;
    };
    this.setEdificioId = function(id){
      edificioId = id;
    }
    this.isNew = function(){
    	return isNew;
    }
    this.setNew = function(bool){
    	isNew = bool;
    }

});