var mysql = require('mysql');

///////////////////////////////////////////////////////
// db connection
var connection = mysql.createConnection({
  user: 'root',
  password: 'superman',
  database: 'timeToKill'
});
connection.connect();

///////////////////////////////////////////////////////
// retrieve all businesses
exports.retrieve = function(callback) {
  connection.query(
    'select * from businesses',
    function(err, results) {
      if (err || results.length === 0) { throw err; }
      callback(results);
    }
  )
};
