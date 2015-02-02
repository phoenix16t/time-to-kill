var app = require('express')();
var bodyParser = require('body-parser');
var q = require('q');
var apis = require('./apis.js');
var db = require('./db.js');
app.use(bodyParser.json());

var respond = function(text) {
  this.response.send("body: " + JSON.stringify(text));
}

///////////////////////////////////////////////////////
// handle ajax
app.all('/', function(request, response, next) {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  next();
});

app.post('/', function(request, response) {

  apis.yelp(request.body.time, request.body.location)
    .then(function(temp) {
      console.log("donions", temp.businesses[0]);
    })
    .catch(function(err) {
      console.error(err);
    });

  // db.retrieve(request.body.venueType)
  //   .then(function(dbResults) {
  //     dbResults.forEach(function(result) {
  //       // result from mysql in milli - converted to js in seconds
  //       console.log("result", result.timestamp.getTime() / 1000);
  //       var current = new Date();
  //       console.log("current", current);
  //       var current = current.getHours() + ":" + current.getMinutes();
  //       console.log("current", current);
  //     });
  //   })
  //   .then(function(temp) {
  //     response.send(temp);
  //   })
  //   .catch(function(err) {
  //     console.error(err);
  //   });

  // this.response = response;

  console.log("replying with body of request");
})

app.listen(3000, '0.0.0.0');
