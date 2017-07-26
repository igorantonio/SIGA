var express = require('express');
var router = express.Router();
var passport = require('passport');


router.get('/map', function(req,res){
	var map;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });
      };
      res.json(map);
  })

module.exports = router;