angular.module('myApp')
    .controller('MapController', ['$scope', '$http', '$mdDialog', function($scope, $http, $mdDialog) {

    var self = this;

    var styles = {
       default: null,
       hide: [
           {
             "featureType": "administrative",
             "elementType": "geometry",
             "stylers": [
               {
                 "visibility": "off"
               }
             ]
           },
           {
             "featureType": "administrative.land_parcel",
             "elementType": "labels",
             "stylers": [
               {
                 "visibility": "off"
               }
             ]
           },
           {
             "featureType": "poi",
             "stylers": [
               {
                 "visibility": "off"
               }
             ]
           },
           {
             "featureType": "poi",
             "elementType": "labels.text",
             "stylers": [
               {
                 "visibility": "off"
               }
             ]
           },
           {
             "featureType": "road",
             "elementType": "labels.icon",
             "stylers": [
               {
                 "visibility": "off"
               }
             ]
           },
           {
             "featureType": "road.local",
             "elementType": "labels",
             "stylers": [
               {
                 "visibility": "off"
               }
             ]
           },
           {
             "featureType": "transit",
             "stylers": [
               {
                 "visibility": "off"
               }
             ]
           }
          ]
    };

    function addMarker(edificio){

    	// sets the current location from the edificio data
        var location = {lat:parseFloat(edificio.geolocalizacao.latitude), lng: parseFloat(edificio.geolocalizacao.longitude) };
        var marker = new google.maps.Marker({
           position: location,
           map: self.map
        });
        // modal referring to the current building
        marker.addListener('click', function(ev) {
        $mdDialog.show({
        	locals: { ed: edificio },
		  	controller: ['$scope', 'ed', function($scope, ed) { 
		    $scope.ed = ed;
		  }],
            templateUrl: '../views/modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen
        });
    });
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

    //draws the base map calling the google api 
    self.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -7.214455941427701, lng: -395.90871261099613},
         zoom: 17,
      }
    );

    $scope.loadData();

    self.map.setOptions({styles: styles['hide']}); // removes the non necessary info from the map



}]);