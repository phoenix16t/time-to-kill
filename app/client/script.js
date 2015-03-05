$(document).ready(function() {
  // TODO - validate time and location
  var q            = require('q');
  var venueType    = $('#venueType');
  var time         = $('#time');
  var location     = $('#location');
  var status       = $('#status');
  var submit       = $('#submit');
  var mapCanvas    = document.getElementById('map-canvas');
  var server       = 'http://127.0.0.1:3000';
  var venueCounter = 0;
  var venueInfo    = [];
  var venueList    = $('#info ul');
  var mapDisplay;
  var lat;
  var lng;

  ///////////////////////////////////////////////////////
  // get lat and lng
  var findCoords = function() {
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
  };

  ///////////////////////////////////////////////////////
  // get address
  var findAddress = function(lat, lng) {
    var deferred = q.defer();
    var latlng = new google.maps.LatLng(lat, lng);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if(status === google.maps.GeocoderStatus.OK) {
        deferred.resolve(results);
      }
      else {
        console.error('Geocoder failed - ', status);
        deferred.reject(new Error(status));
      }
    });
    return deferred.promise;
  };

  ///////////////////////////////////////////////////////
  // ajax request
  var findVenues = function(location) {
    var deferred = q.defer();
    $.ajax({
      url: server,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        'venueType': venueType.val(),
        'time': time.val(),
        'location': location
      }),
      success: function(data) {
        deferred.resolve(data);
      },
      error: function(data) {
        deferred.reject(new Error(data));
      }
    });
    return deferred.promise;
  };

  ///////////////////////////////////////////////////////
  // draw map
  var mapVenues = function(venues) {
    // draw map
    var coords = new google.maps.LatLng(lat, lng);
    var options = {
      zoom: 15,
      center: coords
    };
    mapDisplay = new google.maps.Map(mapCanvas, options);

    // draw user's marker
    var markers = [];
    markers.push(createMarker(mapDisplay, coords, null));

    // draw venue markers
    venues.forEach(function(venue) {
      markers.push(createMarker(mapDisplay, venue.location.coordinate.latitude, venue.location.coordinate.longitude, venue));
    });

    console.log('ven info', venueInfo);
  };

  ///////////////////////////////////////////////////////
  // create marker
  var createMarker = function(mapDisplay, coord1, coord2, venue) {
    var icon;
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    var animation;

    if(coord2) {
      var letter = letters[venueCounter++];
      icon = 'images/' + letter + '.png';
      venueInfo.push(letter + ' - ' + venue.name);
      venueList.append('<li>' + letter + ' - ' + venue.name + '<div class="hide" data-lat="' + coord1 + '" data-lng="' + coord2 + '">' + venue.location.address[0] + '</div></li>');
      coord1 = new google.maps.LatLng(coord1, coord2);
    } else {
      icon = 'images/star.png';
      animation = google.maps.Animation.BOUNCE;
    }

    return new google.maps.Marker({
      position: coord1,
      map: mapDisplay,
      animation: animation,
      icon: icon
    });
  };

  ///////////////////////////////////////////////////////
  // main application controller
  var killTime = function() {
    status.text('Finding location coordinates...');
    location.text('');
    findCoords()
      .then(function(result) {
        lat = result.coords.latitude;
        lng = result.coords.longitude;
        status.text('Coordinates found. Finding address...');
        location.text('Latitude: ' + lat + ' - Longitude: ' + lng);
        return findAddress(lat, lng);
      })
      .then(function(result) {
        status.text('Address found. Finding venues...');
        location.text(result[0].formatted_address);
        console.log("r", result[0].formatted_address);
        return findVenues(lat + "," + lng);
      })
      .then(function(results) {
        status.text('Venues found. Drawing map...');
        return mapVenues(JSON.parse(results));
      });
  };

  ///////////////////////////////////////////////////////
  // listeners
  submit.click(function() {
    killTime();
  });

  $('#info ul').on('click', 'li', function() {
    if($(this).children().hasClass('hide')) {
      var latitude = $(this).children().data('lat');
      var longitude = $(this).children().data('lng');
      $('#info ul li').children().addClass('hide');
      $(this).children().removeClass('hide');
      console.log('child', $(this).children().data('lat'), $(this).children().data('lng'), mapDisplay);
      mapDisplay.setCenter({lat: latitude, lng: longitude});
    } else {
      $('#info ul li').children().addClass('hide');
    }
  });
});
