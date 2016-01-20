var pg = require('pg');
var q = require('q');

var DbHandler = function() {
  this.connection = "postgres://root:@localhost/timetokill";
  this.zipList = [];
};

DbHandler.constructor = DbHandler;

DbHandler.prototype.runQuery = function(query, cb) {
  pg.connect(this.connection, function(err, client, done) {
    if(err) { return console.error('error:', err); }

    client.query(query, function(err, result) {
      done();
      if(err) { return console.error('query error:', err); }

      if(cb) { cb(result); }
    });
  });
};

DbHandler.prototype.findZip = function(zip, distance) {
  this.zip = zip;
  this.distance = distance;

  var deferred = q.defer();

  var query = 'select max_range from zip_codes where zip = \'' + zip + '\'';
  var goodData = false;

  this.runQuery(query, function(result) {
    if(result.rows[0] && result.rows[0].max_range >= distance) {
      goodData = true;
    }
    deferred.resolve(goodData);
  });
  return deferred.promise;
};


DbHandler.prototype.insertZips = function(zipObj) {
  var queries = [];

  queries.push('delete from zip_codes where zip = \'' + this.zip + '\'');
  queries.push('insert into zip_codes (zip, max_range) values (\'' + this.zip + '\',' + this.distance + ')');
  queries.push('delete from zip_radius where zip1 = \'' + this.zip + '\' or zip2 = \'' + this.zip + '\'');
  queries.push('insert into zip_radius (zip1, zip2, distance) values ');

  zipObj.forEach(function(zip2, i) {
    if(i !== 0) { queries[queries.length - 1] += ','; }

    var str = this.zip < zip2.zip ?
      [this.zip, zip2.zip, zip2.distance].join(',') : [zip2.zip, this.zip, zip2.distance].join(',');

    queries[queries.length - 1] += '(' + str + ')';
  }.bind(this));

  queries.forEach(function(query) {
    this.runQuery(query);
  }.bind(this));
  
  this.zipList = zipObj.map(function(item) {
    return item.zip;
  });

  return this.zipList;
};

DbHandler.prototype.retrieveZips = function() {
  var deferred = q.defer();

  var query = 'select * from zip_radius where distance <= ' + this.distance + ' and (zip1 = \'' + this.zip + '\' or zip2 = \'' + this.zip + '\')';

  this.runQuery(query, function(results) {
    results.rows.forEach(function(row) {
      if(row.zip1 === this.zip) {
        this.zipList.push(row.zip2);
      }
      else {
        this.zipList.push(row.zip1);
      }
    }.bind(this));
    deferred.resolve(this.zipList);
  }.bind(this));

  return deferred.promise;
};

DbHandler.prototype.retrieveVenues = function() {
  var deferred = q.defer();
  var query = 'select * from venues where zip in (\'' + this.zipList.join('\',\'') + '\')';

  this.runQuery(query, function(results) {
    deferred.resolve(results.rows);
  });

  return deferred.promise;
};

DbHandler.prototype.findOutdatedZips = function() {
  var deferred = q.defer();
  var query = 'select * from zip_venues where zip in (\'' + this.zipList.join('\',\'') + '\') and last_update < current_date';

  this.runQuery(query, function(results) {
    deferred.resolve(results.rows);
  });

  return deferred.promise;
};

exports.DbHandler = new DbHandler();
