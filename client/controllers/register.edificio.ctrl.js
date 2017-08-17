angular.module('myApp')
    .controller('RegisterEdificioController', ['$scope', '$http', '$mdDialog',
        function ($scope, $http, $mdDialog) {

            var self = this;

            self.close = function () {
                $mdDialog.cancel();
            };

            self.registerEdificio = function() {

                // initial values
                $scope.error = false;
                $scope.disabled = true;

                $http.post('/edificio',
                 {nome: self.nome, descricao: self.descricao, atividade: self.atividade,
                    caracteristicasFisicas: {localizacao: {setor: self.setor, bloco: self.bloco}, 
                    area: self.area, n_pavimentos: self.n_pavimentos, ocupacaoMedia: self.ocupacaoMedia,
                    n_baciasSanitarias: self.n_baciasSanitarias, n_torneiras: self.n_torneiras, 
                    n_duchas: self.n_duchas, n_chuveiros: self.n_chuveiros, n_pias: self.n_pias, 
                    volumeReservatorio: self.volumeReservatorio}, geolocalizacao: {latitude: self.latitude, 
                    longitude: self.longitude}, mediaEsperada: self.mediaEsperada})
                    .success(function(){
                        self.close();
                        console.long('muito bom');
                    })
                    .error(function(){
                        console.log('nada bom');
                    });
            };

}]);