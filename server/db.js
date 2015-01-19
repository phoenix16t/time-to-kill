var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: String
});

mongoose.connect('mongodb://localhost:27017/ttk');

var db = mongoose.connection;
db.on('error', function() { console.error("Error"); });

function finder(businesses) {
  db.open('open', function(error) {
    if(error) { console.error("error:", error); }

    var Business = mongoose.model('businesses', schema);

    businesses.forEach(function(business) {
      console.log("searching for", business);
      Business.find({name: business.name}, function(err, result) {
        if(err) {console.error("err", err); }
        if(result.length === 0) {
          console.log("couldn't find", business.name + ", adding...");
          var newBiz = new Business({ name: business.name });
          newBiz.save(function(err, result) {
            console.log("===> added", business.name);
          });
        }
        else {
          console.log("found", business.name);
        }
      });
    });

    // var test = new ttk({x: 14});
    // test.save(function(err, test) {
    //   console.log("success");
    // })



  });
}

exports.finder = finder;
