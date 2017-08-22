angular.module('myApp')
  .service('userService', function() {
    
    var userId = {};
  	var isNew = false;
  	var user = {};

    this.getUser = function(){
      return user;
    };
    this.setUser = function(us){
      user = us;
    }
});