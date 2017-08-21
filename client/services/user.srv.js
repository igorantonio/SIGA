angular.module('myApp')
  .service('userService', function() {
    
    var userId = {};
  	var isNew = false;
  	var user = {};

    this.getUser = function(){
      return user;
    };
    this.setEdificio = function(us){
      user = us;
    }

    this.getUserId = function(){
      return userId;
    };

    this.setUserId = function(id){
      userId = id;
    };
    
    this.isNew = function(){
    	return isNew;
    };
    this.setNew = function(bool){
    	isNew = bool;
    };

});