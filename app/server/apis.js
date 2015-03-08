var data = require("./data.js");
var test_data = require("./test_data.js");
var q = require('q');
var yelpConnection = require("yelp").createClient(data.yelp);

var searcher = function(options) {
  var deferred = q.defer();
  yelpConnection.search(options, function(err, result) {
    if(err) {
      deferred.reject(new Error(err));
    }
    else {
      deferred.resolve(result);
    }
  });
  return deferred.promise;
};

var stripBusinesses = function(businesses) {
  return businesses.map(function(business) {
    return {
      name: business.name,
      latitude: business.location.coordinate.latitude,
      longitude: business.location.coordinate.longitude
    };
  });
};

var stripData = function(venues) {
  var reformatted = {};

  venues.forEach(function(captured) {
    for(var category in captured) {
      reformatted[category] = [];

      var businesses = captured[category].businesses;
      reformatted[category] = stripBusinesses(businesses);
    }
  });

  return reformatted;
};

///////////////////////////////////////////////////////
// yelp
exports.yelp = function (time, location, callback) {

  // early exit - let's not bother yelp for now
  // var deferred = q.defer();
  // deferred.resolve([test_data.bars1, test_data.bars2, test_data.restaurants1, test_data.restaurants2]);
  // return deferred.promise;


  // walking speed - 5000 meter per hour, divided by 2 to account for return time
  var meters = (time * 5000) / 2;
  console.log("Searching for locations around zip", location, "reachable in", time/2, "hour(s) (", meters, "meters walking)");    // logging

  var options = {
    ll: location,
    radius_filter: meters,
    category_filter: 'bars',
    limit: 20,
    offset: 0,
    sort: 1
  };

  var options2 = {
    ll: location,
    radius_filter: meters,
    category_filter: 'bars',
    limit: 20,
    offset: 20,
    sort: 1
  };

  var options3 = {
    ll: location,
    radius_filter: meters,
    category_filter: 'restaurants',
    limit: 20,
    offset: 0,
    sort: 1
  };

  var options4 = {
    ll: location,
    radius_filter: meters,
    category_filter: 'restaurants',
    limit: 20,
    offset: 20,
    sort: 1
  };

  var allResults = [];

  return searcher(options)
    .then(function(results) {
      allResults.push({bars1: results});
      return searcher(options2);
    })
    .then(function(results) {
      allResults.push({bars2: results});
      return searcher(options3);
    })
    .then(function(results) {
      allResults.push({restaurants1: results});
      return searcher(options4);
    })
    .then(function(results) {
      allResults.push({restaurants2: results});
      return allResults;
    })
    .then(function(results) {
      return stripData(results);
    })
    .catch(function(err) {
      console.error(err);
    });
};
