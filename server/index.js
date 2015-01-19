var app = require('express')();
var bodyParser = require('body-parser');
var apis = require('./apis.js');
// var db = require('mongodb');
var db = require('./db.js');

// var MongoClient = db.MongoClient;
// var Server = db.Server;


// function appResponse(response, text) {
//   response.send("body: " + JSON.stringify(text));
// }


app.use(bodyParser.json());

app.all('/', function(request, response, next) {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  next();
});

app.post('/', function(request, response) {
  // console.log("time:", request.body.time, "hours");
  // console.log("location:", request.body.location);
  // var mongoClient = new MongoClient(new Server('localhost', 27017), {native_parser: true});
  // console.log("db", db.ttk.find());

  // mongoClient.open(function(err, mongoClient){
  //   var db = mongoClient.db('a');
  //   console.log("db", db);
  // });

  apis.yelp(request.body.time, request.body.location, db.finder);

  console.log("replying with body of request");
  response.send("body " + JSON.stringify(request.body));
})

app.listen(3000);
