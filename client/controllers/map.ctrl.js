angular.module('myApp')
.controller('MapController', ['$scope', '$http', '$mdDialog', '$window', 'edificioService', function ($scope, $http, $mdDialog, $window, edificioService) {

    var self = this;
    self.markers = {};
    var icons = {
        todos: {
            size: new google.maps.Size(30, 30),
            scaledSize: new google.maps.Size(30, 30),
            url: '../lib/icons/marker_blue.png'
        },
        alerta0: {
            size: new google.maps.Size(30, 30),
            scaledSize: new google.maps.Size(30, 30),
            url: '../lib/icons/marker_yellow.png'
        },
        alerta1: {
            size: new google.maps.Size(30, 30),
            scaledSize: new google.maps.Size(30, 30),
            url: '../lib/icons/marker_red.png'
        }
    };

    function addMarker(edificio, icon, caixe) {
        if (self.markers.hasOwnProperty(edificio._id)) {
            self.markers[edificio._id].setIcon(icon);
            return;
        };

        // sets the current location from the edificio data
        var location = { 
            lat: parseFloat(edificio.geolocalizacao.latitude), 
            lng: parseFloat(edificio.geolocalizacao.longitude) 
        };

        var marker = new google.maps.Marker({
            position: location,
            icon: icon,
            map: self.map,
            optimized: false,
            edificio: edificio._id
        });


        // modal referring to the current building
        marker.addListener('click', function (ev) {
            $scope.edificio = edificio;
            $scope.isCaixa = caixe;
            edificioService.setEdificioId(edificio._id);
            edificioService.setCaixa(caixe);
            var template;
            if (caixe){
              template = '../views/caixa.html'
            }else{
              template = '../views/modal.html'

            };

            $mdDialog.show({
                templateUrl: template,
                parent: angular.element(document.body),
                scope: $scope.$new(),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen,
                controller: 'DialogController',
                controllerAs: 'ctrl'
            });
        });
        self.markers[edificio._id] = marker;
    };

    // request the edificios' data from the api and send it to the addMarker method to be drawn
    $scope.loadData = function () {

        $http.get("/edificio", { params: { withAlerta: true } })
            .then(function (response, ev) {
                $scope.data = response.data;

                for (i in response.data) {
                    for (j in response.data[i]) {
                        var edificio = response.data[i][j];
                        // the following line checks if the json edificio object have the required params to be drawn
                        if (edificio.hasOwnProperty('geolocalizacao')
                            && edificio['geolocalizacao'].hasOwnProperty('latitude')) {
                            addMarker(edificio, icons[i], false);
                        };
                    }
                }
                //return if uccess on fetch

            }, function () {
                $scope.data = "error in fetching data"; //return if error on fetch
            });

    };

    $scope.loadCaixas = function () {

        $http.get("/caixa", { params: { withAlerta: true } })
            .then(function (response, ev) {
                $scope.data = response.data;
                console.log(response.data);

                for (i in response.data) {
                    for (j in response.data[i]) {
                        var edificio = response.data[i][j];
                        // the following line checks if the json edificio object have the required params to be drawn
                        if (edificio.hasOwnProperty('geolocalizacao')
                            && edificio['geolocalizacao'].hasOwnProperty('latitude')) {
                            addMarker(edificio, icons[i], true);
                        };
                    }
                }
                //return if uccess on fetch

            }, function () {
                $scope.data = "error in fetching data"; //return if error on fetch
            });
    };

    self.initMap = function () {
        //draws the base map calling the google api 
        self.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: -7.214455941427701, lng: -395.90871261099613 },
            zoom: 17,
        }
        );
        $scope.loadData();
        $scope.loadCaixas();
        self.map.setOptions({ styles: styles['hide'] });

    };

    self.initMap();
    // removes the non necessary info from the map

    self.showOnlySetor = function (setor) {
        for (key in self.markers) {
            self.markers[key].setVisible(false);
        };
        $http.get("/edificio", {
            params: { setor: setor }
        })
            .then(function (response, ev) {
                for (var i in response.data) {
                    var edificio = response.data[i];
                    self.markers[edificio._id].setVisible(true);
                }
            }, function () {
                $scope.data = "error in fetching data"; //return if error on fetch
            });

    };

    self.showEdificiosAlerta = function (nivelAlerta) {
        for (key in self.markers) {
            self.markers[key].setVisible(false);
        };
        $http.get("/edificio", { params: { nivelAlerta: nivelAlerta } })
            .then(function (response, ev) {
                for (var i in response.data) {
                    var edificio = response.data[i];
                    console.log(edificio);
                    if (nivelAlerta == '1') {
                        self.markers[edificio._id].setIcon(icons.alerta1);
                        self.markers[edificio._id].setVisible(true);
                    } else if (nivelAlerta == '0') {
                        self.markers[edificio._id].setIcon(icons.alerta0);
                        self.markers[edificio._id].setVisible(true);
                    }
                }
            });
    };

    this.openMenu = function ($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
    };

    this.redial = function () {
        for (key in self.markers) {
            self.markers[key].setVisible(true);
        }
        ;
    };

    self.openGeneralInfoDialog = function (ev) {
        
        var UFCG_ID = 0;
        edificioService.setEdificioId(UFCG_ID);
        edificioService.setCaixa(false);

        $mdDialog.show({
            templateUrl: '../views/modal.html',
            parent: angular.element(document.body),
            scope: $scope.$new(),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen,
            controller: MyDialogController,
            controllerAs: 'ctrl'
        });
        function MyDialogController($scope, $mdDialog, $q, $http) {
            var self = this;
            $scope.showInfos = false;
            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
            function getEstatisticas() {
                var q = $q.defer();
                var route = "/universidade";
                
                $http.get(route).then(function (info) {
                    q.resolve(info.data);
                    self.estatisticas = info.data.estatisticas;
                }, function (info) {
                    console.log('Rota errada')
                });
                return q.promise;
            }
            var init = function () {
                getEstatisticas();
            };
            init();
        }
    }

}]);