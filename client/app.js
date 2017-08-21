var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate','ngAria', 'ngSanitize', 'ngMaterial', 'openlayers-directive']);

myApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      access: {restricted: false}
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'SessionController',
      access: {restricted: false}
    })
    .when('/register', {
      templateUrl: 'views/register.html',
      controller: 'registerController',
      access: {restricted: true}
    })
    .when('/panel', {
      templateUrl: 'views/panel.html',
      controller: 'PanelController as ctrl',
      access: {restricted: true}
    })
    .otherwise({
      redirectTo: '/'
    });
});

myApp.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      AuthService.getUserStatus()
      .then(function(){
        if ((next.acess == null || next.access.restricted) && !AuthService.isLoggedIn()){
          $location.path('/login');
          $route.reload();
        }
      });
  });
});