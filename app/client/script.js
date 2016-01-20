$(document).ready(function() {
  // TODO - validate time and location
  var q            = require('q');
  var venueType    = $('#venueType');
  var time         = $('#time');
  var locText      = $('#location');
  var statusText   = $('#status');
  var submit       = $('#submit');
  var categories   = $('#category-list');
  var mapCanvas    = document.getElementById('map-canvas');
  var server       = 'http://127.0.0.1:3000';
  var venueCounter = 0;
  var venueInfo    = [];
  var venueList    = $('#info ul');
  var mapDisplay;
  var allVenues;
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
  var findVenues = function(latLng, zip) {
    var deferred = q.defer();
    $.ajax({
      url: server,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        'venueType': venueType.val(),
        'time': time.val(),
        'latLng': latLng,
        'zip': zip
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
  // list categories returned from yelp
  var listCategories = function(venues) {
    for(var venue in venues) {
      categories.append(
        '<div class="category" id="' + venue + '"><input name="category" type="radio" value="' + venue + '">' + venue + '</div>'
      );
    }
  };

  ///////////////////////////////////////////////////////
  // draw map
  var mapVenues = function(selected) {
    console.log("huh?", selected);
    console.log("all", allVenues);
    console.log("all2", allVenues[selected]);

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

    allVenues[selected].forEach(function(venue) {
      markers.push(createMarker(mapDisplay, venue.latitude, venue.longitude, venue));
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
      if(venueCounter === 25) { venueCounter = 0; }
      var letter = letters[venueCounter++];
      icon = 'images/' + letter + '.png';
      venueInfo.push(letter + ' - ' + venue.name);
      // venueList.append('<li>' + letter + ' - ' + venue.name + '<div class="hide" data-lat="' + coord1 + '" data-lng="' + coord2 + '">' + venue.location.address[0] + '</div></li>');
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
    statusText.text('Finding location coordinates...');
    locText.text('');

    findCoords()
      .then(function(coords) {
        lat = coords.coords.latitude;
        lng = coords.coords.longitude;
        statusText.text('Coords found. Finding address...');
        locText.text('Lat: ' + lat + ' - Lng: ' + lng);
        return findAddress(lat, lng);
      })
      .then(function(address) {
        statusText.text('Address found. Finding venues...');
        console.log("address", address);
        locText.text(address[0].formatted_address);
        var regex = /\w\w (\d{5}),/g;
        address[0].formatted_address.match(regex);
        return findVenues(lat + "," + lng, RegExp.$1);
      })
      .then(function(venues) {
        venues = JSON.parse(venues);
        statusText.text('Venues found. Drawing map...');
        listCategories(venues);
        allVenues = venues;
//        return mapVenues(venues);
      })
      .then(function(results) {

      });
  };

  ///////////////////////////////////////////////////////
  // listeners
  submit.click(function() {
    killTime();
  });

  $('#category-list').on('click', '.category', function() {
    console.log("this", $(this).attr('id'));
    mapVenues($(this).attr('id'));
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
