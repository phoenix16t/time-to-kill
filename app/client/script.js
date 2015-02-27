$(document).ready(function() {
  // TODO - validate time and location
  var q = require('q');
  var venueType = $('#venueType');
  var time = $('#time');
  var location = $('#location');
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
  // get geolocation
  function findLocation() {
    if(navigator.geolocation) {
      var deferred = q.defer();
      navigator.geolocation.getCurrentPosition(function(err, result) {
        if(err) {
          deferred.resolve(result);
        }
        else {
          deferred.resolve(result);
        }
      });
      return deferred.promise;
    }
  }

  ///////////////////////////////////////////////////////
  // ajax request
  var killTime = function() {

    console.log("location", findLocation());

    geocoder.geocode({'address': location.val()}, function(results, status) {
      console.log("results", results);
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
