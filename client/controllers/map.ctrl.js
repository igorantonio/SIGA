angular.module('myApp')
    .controller('MapController', ['$scope', '$http', '$mdDialog', '$window', 'edificioService', function($scope, $http, $mdDialog, $window, edificioService) {

    var self = this;
	   self.markers = {};
   

    function addMarker(edificio){

    	// sets the current location from the edificio data
        var location = {lat:parseFloat(edificio.geolocalizacao.latitude), lng: parseFloat(edificio.geolocalizacao.longitude) };
        var image = '../lib/icons/marker.png';

        var marker = new google.maps.Marker({
           position: location,
           icon: {size: new google.maps.Size(30, 30),
                 scaledSize: new google.maps.Size(30, 30),
                 url: image},
           map: self.map,
           edificio: edificio._id
        });


        // modal referring to the current building
        marker.addListener('click', function(ev) {
          $scope.edificio = edificio;
          edificioService.setEdificioId(edificio._id);

          $mdDialog.show({
              templateUrl: '../views/modal.html',
              parent: angular.element(document.body),
              scope: $scope.$new(), 
              targetEvent: ev,
              clickOutsideToClose: true,
              fullscreen: $scope.customFullscreen
          });
        });
        self.markers[edificio._id] = marker;
    };

    
// request the edificios' data from the api and send it to the addMarker method to be drawn
$scope.loadData = function () {

    $http.get("/edificio")
        .then(function(response, ev){
            $scope.data = response.data;
            for (var i in response.data){
            	var edificio = response.data[i];
            	// the following line checks if the json edificio object have the required params to be drawn
            	if (edificio.hasOwnProperty('geolocalizacao') 
            		&& edificio['geolocalizacao'].hasOwnProperty('latitude')){
            		 addMarker(edificio);
            	};
            }
             //return if uccess on fetch
            
        }, function() {
        	            console.log(response.data);
            $scope.data = "error in fetching data"; //return if error on fetch
        });
    };

self.initMap = function(){
    //draws the base map calling the google api 
    self.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -7.214455941427701, lng: -395.90871261099613},
         zoom: 17,
      }
    );

    $scope.loadData();
 self.map.setOptions({styles: styles['hide']}); 

};

self.initMap();

    

   // removes the non necessary info from the map

    self.showOnlySetor = function(setor){
    	for (key in self.markers){
    		self.markers[key].setVisible(false);
    	};
    	$http.get("/edificio",  {
    params: { setor: setor }})
        .then(function(response, ev){
            for (var i in response.data){
            	var edificio = response.data[i];
            	self.markers[edificio._id].setVisible(true);
             //return if uccess on fetch
			}            
        }, function() {
            $scope.data = "error in fetching data"; //return if error on fetch
        });

    };

var originatorEv;

        this.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

this.redial = function() {
  for (key in self.markers){
        self.markers[key].setVisible(true);
  };
};

}]);