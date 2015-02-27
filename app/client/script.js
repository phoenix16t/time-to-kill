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
  function findAddress(arg) {
    var deferred = q.defer();
    var latlng = new google.maps.LatLng(arg.coords.latitude, arg.coords.longitude);
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
  var killTime = function() {

    status.text("Finding coordinates...");
    location.text("");
    findCoords()
      .then(function(result) {
        status.text("Coordinates found. Finding address...");
        return findAddress(result);
      })
      .then(function(result) {
        status.text("Address found");
        location.text(result[0].formatted_address);
      });

    $.ajax({
      url: server,
      type: 'POST',
      data: JSON.stringify({
        "venueType": venueType.val(),
        "time": time.val(),
        "location": location.val()
      }),
      contentType: 'application/json',
      success: function(data) {
        console.log("success", data);
      },
      error: function(data) {
        console.log("error", data);
      }
    });
  };

  google.maps.event.addDomListener(window, 'load', initialize);

  submit.click(function() {
    killTime();
  });
});
