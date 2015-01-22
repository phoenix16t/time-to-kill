var app = require('express')();
var bodyParser = require('body-parser');
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
  apis.yelp(request.body.time, request.body.location, db.finder);

  this.response = response;
  db.retrieve(respond);

  console.log("replying with body of request");
})

app.listen(3000);
