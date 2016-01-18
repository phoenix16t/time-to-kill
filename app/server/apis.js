var data = require("./data.js");
var test_data = require("./test_data.js");
var q = require('q');
var yelpConnection = require("yelp").createClient(data.yelp);

var stripBusinesses = function(businesses) {
  return businesses.map(function(business) {
    return {
      name: business.name,
      latitude: business.location.coordinate.latitude,
      longitude: business.location.coordinate.longitude
    };
  });
};

var businessBatch = function(options) {
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

var findBusinesses = function(options) {
  var foundBusinesses;

  var altOptions = {
    ll: options.ll,
    radius_filter: options.radius_filter,
    category_filter: options.category_filter,
    limit: 20,
    offset: 20,
    sort: 1
  };

  return businessBatch(options)
    .then(function(results) {
      foundBusinesses = stripBusinesses(results.businesses);
      return businessBatch(altOptions);
    })
    .then(function(results) {
      return foundBusinesses.concat(stripBusinesses(results.businesses));
    });
};


///////////////////////////////////////////////////////
// yelp
exports.yelp = function (time, location, callback) {
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

  var allResults = {};

  return findBusinesses(options)
    .then(function(results) {
      allResults.bars = results;
      options.category_filter = 'restaurants';
      return findBusinesses(options);
    })
    .then(function(results) {
      allResults.restaurants = results;
      console.log("all results", allResults);
      return allResults;
    })
    .catch(function(err) {
      console.error(err);
    });
};
