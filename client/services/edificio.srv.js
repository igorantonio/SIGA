angular.module('myApp')
  .service('edificioService', function() {
    var edificioId = {};

    return {
      getEdificioId: function () {
          return edificioId;
      },
      setEdificioId: function (value) {
          edificioId = value;
      }
    };
});