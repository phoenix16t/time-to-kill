var key = require("./yelp_key.js");
var yelpConnection = require("yelp").createClient(key);

///////////////////////////////////////////////////////
// yelp
exports.yelp = function (time, location, callback) {
  // walking speed - 5000 meter per hour, divided by 2 to account for return time
  var meters = (time * 5000) / 2;
  console.log("Searching for locations around zip", location, "reachable in", time/2, "hour(s) (", meters, "meters walking)");    // logging

  yelpConnection.search({
    location: location,
    radius_filter: meters,
    category_filter: 'bars',
    offset: 20,
    sort: 1
  }, 
  function(error, data) {
    console.log("user's lat:", data.region.center.latitude);
    console.log("user's lng:", data.region.center.longitude);
    // console.log("business:", data.businesses[0]);

    // callback(data.businesses);
  });
}
