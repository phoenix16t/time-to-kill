var app = require('express')();
var bodyParser = require('body-parser');
var apis = require('./apis.js');
var db = require('./db.js');
var q = require('q');
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
  // apis.yelp(request.body.time, request.body.location, db.finder);

  db.retrieve(request.body.venueType)
    .then(function(temp) {
      console.log("caller", temp);
    })
    .then(function(temp) {
      response.send(temp) })
    .catch(function(err) {
      console.error(err);
    });

  // this.response = response;

  console.log("replying with body of request");
})

app.listen(3000, '0.0.0.0');
