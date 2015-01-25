var mysql = require('mysql');
var knex = require('knex');

///////////////////////////////////////////////////////
// db connection
var db = knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'superman',
    database: 'timeToKill'
  }
});

///////////////////////////////////////////////////////
// retrieve all businesses
exports.retrieve = function(type) {
  console.log("type", type);
  return db('businesses').select().where({type: type})
    .then(function(results) {
      return results;
    })
    .catch(function(err) {
      console.error(err);
    });
};
