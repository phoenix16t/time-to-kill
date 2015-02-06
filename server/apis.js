var data = require("./data.js");
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

///////////////////////////////////////////////////////
// yelp
exports.yelp = function (time, location, callback) {

  // early exit - let's not bother yelp for now
  var deferred = q.defer();
  deferred.resolve([data.bars1, data.bars2, data.restaurants1, data.restaurants2]);
  return deferred.promise;


  // walking speed - 5000 meter per hour, divided by 2 to account for return time
  var meters = (time * 5000) / 2;
  console.log("Searching for locations around zip", location, "reachable in", time/2, "hour(s) (", meters, "meters walking)");    // logging

  var options = {
    location: location,
    radius_filter: meters,
    category_filter: 'bars',
    limit: 20,
    offset: 0,
    sort: 1
  };

  var options2 = {
    location: location,
    radius_filter: meters,
    category_filter: 'bars',
    limit: 20,
    offset: 20,
    sort: 1
  };

  var options3 = {
    location: location,
    radius_filter: meters,
    category_filter: 'restaurants',
    limit: 20,
    offset: 0,
    sort: 1
  };

  var options4 = {
    location: location,
    radius_filter: meters,
    category_filter: 'restaurants',
    limit: 20,
    offset: 20,
    sort: 1
  };

  var allResults = [];

  return searcher(options)
    .then(function(results) {
      allResults.push(results);
      return options2;
    })
    .then(searcher)
    .then(function(results) {
      allResults.push(results);
      return options3;
    })
    .then(searcher)
    .then(function(results) {
      allResults.push(results);
      return options4;
    })
    .then(searcher)
    .then(function(results) {
      allResults.push(results);
      // TODO:  modify this return value to work correctly
      return allResults;
    })
    .catch(function(err) {
      console.error(err);
    });
};
