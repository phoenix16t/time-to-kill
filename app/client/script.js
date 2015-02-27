$(document).ready(function() {
  // TODO - validate time and location
  var q = require('q');
  var venueType = $('#venueType');
  var time = $('#time');
  var location = $('#location');
  var status = $('#status');
  var submit = $('#submit');
  var geocoder;
  var server = 'http://127.0.0.1:3000';

  ///////////////////////////////////////////////////////
  // mapping function
  function initialize() {
    geocoder = new google.maps.Geocoder();
    var myLatlng = new google.maps.LatLng(-25.363882, 131.044922);
  }

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
  function findAddress(coords) {
    var deferred = q.defer();
    var latlng = new google.maps.LatLng(coords.latitude, coords.longitude);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if(status === google.maps.GeocoderStatus.OK) {
        console.log("restslsdjkf", results);
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
        deferred.reject(data);
      }
    });
    return deferred.promise;
  }

  ///////////////////////////////////////////////////////
  // main application controller
  var killTime = function() {
    status.text("Finding location coordinates...");
    location.text("");
    findCoords()
      .then(function(result) {
        status.text("Coordinates found. Finding address...");
        return findAddress(result.coords);
      })
      .then(function(result) {
        status.text("Address found");
        location.text(result[0].formatted_address);
        return findVenues(result[0].formatted_address);
      })
      .then(function(result) {
        status.text("Venues found");
        console.log("venues", result);
      });
  };

  google.maps.event.addDomListener(window, 'load', initialize);

  submit.click(function() {
    killTime();
  });
});
