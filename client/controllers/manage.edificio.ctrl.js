angular.module('myApp')
    .controller('ManageEdificioController', ['$scope', '$http', '$mdDialog', 'edificioService',
        function ($scope, $http, $mdDialog, edificioService, fileReader) {

            var self = this;
            self.edificio = edificioService.getEdificio();
            self.alerta = edificioService.getAlerta();

            $scope.$on("fileProgress", function(e, progress) {
                self.progress = progress.loaded / progress.total;
            });

            self.message = function(){
                if(edificioService.isNew())
                    return "Novo edifício";
                return "Editar edificio";
            };

            self.operation = function() {
                if(edificioService.isNew())
                    self.registerEdificio();
                if(!edificioService.isNew())
                    self.editEdificio();
            };

            self.close = function () {
                $mdDialog.hide();
            };

            self.registerEdificio = function() {

                // initial values
                self.error = false;
                self.disabled = true;

                console.log(self.edificio.img);

                $http.post('/edificio', self.edificio)
                    .success(function(){
                        self.close();
                    })
                    .error(function(){
                        self.error = true;
                        self.errorMessage = "Algo está errado! Lembre-se que: "
                                            + "A atividade deve ter no mínimo 3 caracteres; "
                                            + "A descrição deve ter no mínimo 10 caracteres; "
                                            + "É importante que  a latitude e longitude sejam "
                                            + "diferentes de zero; Os valores não devem ser "
                                            + "negativos (exceto para latitude e longitude);";
                    });
            };

            self.editEdificio = function() {

                // initial values
                self.error = false;
                self.disabled = true;

                $http.put('/edificio/' + self.edificio._id, self.edificio)
                    .success(function(){
                        self.close();
                    })
                    .error(function(){
                        self.error = true;
                        self.errorMessage = "Algo está errado! Lembre-se que: "
                                            + "A atividade deve ter no mínimo 3 caracteres; "
                                            + "A descrição deve ter no mínimo 10 caracteres; "
                                            + "É importante que  a latitude e longitude sejam "
                                            + "diferentes de zero; Os valores não devem ser "
                                            + "negativos (exceto para latitude e longitude);";
                    });
            };

            self.deleteEdificio = function(){

                self.error = false;
                self.disabled = true;

                $http.delete('/edificio/' + self.edificio._id)
                    .success(function(){
                        self.close();
                    })
                    .error(function(){
                        self.error = true;
                        self.errorMessage = "Algo está errado!";
                    });
            };

            self.addVazamento = function() {

                // initial values
                self.error = false;
                self.disabled = true;

                $http.post('/edificio/' + self.edificio._id + '/vazamentos/new', {volume: self.volume, data: self.data})
                    .success(function(){
                        self.close();
                    })
                    .error(function(status){
                        self.error = true;
                        self.errorMessage = "Algo está errado! " + status;
                    });
            };


            self.updateAlerta = function(alertaID) {

                // initial values
                self.error = false;
                self.disabled = true;

                $http.put('/edificio/' + self.edificio._id + '/alertas/' + alertaID, {checked: true})
                    .success(function(){
                        self.close();
                    })
                    .error(function(status){
                        self.error = true;
                        self.errorMessage = "Algo está errado! " + status;
                    });
            };
}]);