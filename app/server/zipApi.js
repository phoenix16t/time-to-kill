var data = require("./data.js");
var request = require('request');
var pg = require('pg');
var q = require('q');

exports.retrieve = function(zip, distance) {
  var deferred = q.defer();
  var url = 'http://www.zipcodeapi.com/rest/' + data.zipapi + '/radius.json/' + zip + '/' + distance + '/km';
  var compiledZips = [];

  request(url, function (err, resp, body) {
    if (!err && resp.statusCode == 200) {
      JSON.parse(body).zip_codes.forEach(function(zip) {
        compiledZips.push({
          zip: zip.zip_code,
          distance: zip.distance
        });
      });
      deferred.resolve(compiledZips);
    }
  });

  return deferred.promise;
};
