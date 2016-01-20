var app = require('express')();
var q = require('q');
var bodyParser = require('body-parser');
var zipApi = require('./ZipApi.js');
var venueHandler = require('./VenueHandler.js');

var logger = require('./Logger.js').Logger;
var dbHandler = require('./DbHandler.js').DbHandler;

var data = require("./data.js");

app.use(bodyParser.json());

///////////////////////////////////////////////////////
// handle ajax
app.all('/', function(request, response, next) {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  next();
});

app.post('/', function(request, response) {
  var time = request.body.time;
  var latLng = request.body.latLng;
  var transport = request.body.transport;
  var zip = request.body.zip;

  var zipExists;
  var venueList;
  var updates;

  var distance = 3;

  logger.step('1');
  dbHandler.findZip(zip, distance)
  .then(function(ze) {
    zipExists = ze;
    if(zipExists === true) {
      logger.step('2b');
      return zipExists;
    }

    logger.step('2a-1');
    return zipApi.retrieve(zip, distance)
    .then(function(zipObj) {
      logger.step('2a-2');
      return dbHandler.insertZips(zipObj);
    });
  })
  .then(function() {
    if(logger.currentStep() !== '2b') {
      return results;
    }

    return dbHandler.retrieveZips();
  })
  .then(function() {
    logger.step('3');
    return dbHandler.retrieveVenues();
  })
  .then(function(vl) {
    logger.step('4');
    venueList = vl;

    return dbHandler.findOutdatedZips();
  })
  .then(function(results) {
    logger.step('5');
    updates = results;

    updates.forEach(function(update) {
      console.log("update", update);
    });
  });
});

app.listen(3000, '0.0.0.0');
