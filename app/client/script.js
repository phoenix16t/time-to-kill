$(document).ready(function() {
  // TODO - validate time and location
  var q         = require('q');
  var venueType = $('#venueType');
  var time      = $('#time');
  var location  = $('#location');
  var status    = $('#status');
  var submit    = $('#submit');
  var mapCanvas = document.getElementById('map-canvas');
  var server    = 'http://127.0.0.1:3000';
  var lat;
  var lng;

  ///////////////////////////////////////////////////////
  // get lat and lng
  function findCoords() {
    if(navigator.geolocation) {
      var deferred = q.defer();
      navigator.geolocation.getCurrentPosition(function(result, err) {
        if(err) {
          deferred.reject(new Error(err));
        }
        else {
          deferred.resolve(result);
        }
      });
      return deferred.promise;
    }
  }

  ///////////////////////////////////////////////////////
  // get address
  function findAddress(lat, lng) {
    var deferred = q.defer();
    var latlng = new google.maps.LatLng(lat, lng);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if(status === google.maps.GeocoderStatus.OK) {
        deferred.resolve(results);
      }
      else {
        console.error("Geocoder failed - ", status);
        deferred.reject(new Error(status));
      }
    });
    return deferred.promise;
  }

  ///////////////////////////////////////////////////////
  // ajax request
  function findVenues(location) {
    var deferred = q.defer();
    $.ajax({
      url: server,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        "venueType": venueType.val(),
        "time": time.val(),
        "location": location
      }),
      success: function(data) {
        deferred.resolve(data);
      },
      error: function(data) {
        deferred.reject(new Error(data));
      }
    });
    return deferred.promise;
  }

  ///////////////////////////////////////////////////////
  // draw map
  function mapVenues(venues) {
    var coords = new google.maps.LatLng(lat, lng);
    var options = {
      zoom: 15,
      center: coords
    };
    var map = new google.maps.Map(mapCanvas, options);
    var markers = [];

    var marker = new google.maps.Marker({
      position: coords,
      map: map
    });

    venues.forEach(function(venue) {
      console.log("venue", venue.location.coordinate.latitude);
      var lat = venue.location.coordinate.latitude;
      var lng = venue.location.coordinate.longitude;
      var coords = new google.maps.LatLng(lat, lng);

      markers.push(
        new google.maps.Marker({
          position: coords,
          map: map
        })
      );
    });
  }

  ///////////////////////////////////////////////////////
  // main application controller
  var killTime = function() {
    status.text("Finding location coordinates...");
    location.text("");
    findCoords()
      .then(function(result) {
        lat = result.coords.latitude;
        lng = result.coords.longitude;
        status.text("Coordinates found. Finding address...");
        location.text("Latitude: " + lat + " - Longitude: " + lng);
        return findAddress(lat, lng);
      })
      .then(function(result) {
        status.text("Address found. Finding venues...");
        location.text(result[0].formatted_address);
        return findVenues(result[0].formatted_address);
      })
      .then(function(results) {
        status.text("Venues found. Drawing map...");
        return mapVenues(JSON.parse(results));
      });
  };

  submit.click(function() {
    killTime();
  });
});
