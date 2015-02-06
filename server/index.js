var app = require('express')();
var q = require('q');
var apis = require('./apis.js');
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.set('responder', function(text) {
  app.get('response').send("body: " + JSON.stringify(text));
});

///////////////////////////////////////////////////////
// handle ajax
app.all('/', function(request, response, next) {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  next();
});

app.post('/', function(request, response) {
  app.set('response', response);
  apis.yelp(request.body.time, request.body.location)
    .then(function(yelpResults) {
      console.log("bars1", yelpResults[0]);
      console.log("bars2", yelpResults[1]);
      console.log("restaurants1", yelpResults[2]);
      console.log("restaurants2", yelpResults[3]);
      app.get('responder')(yelpResults);
    })
    .catch(function(err) {
      console.error(err);
    });

  console.log("replying with body of request");
})

app.listen(3000, '0.0.0.0');
