var data = require("./data.js");
var yelpConnect = require("yelp").createClient(data.yelp);

exports.yelp = function(zip) {
  zip = '90034';

  var options = {
    location: zip,
    category_filter: 'bars',
    limit: 20,
    offset: 0,
    sort: 1
  };
  yelpConnect.search(options, function(err, result) {
    console.log("yelp result", result);
  });

  options.offset = 20;
  yelpConnect.search(options, function(err, result) {
    console.log("yelp result2", result);
  });
};
