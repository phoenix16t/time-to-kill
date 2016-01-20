var Logger = function() {
  this.messages = {
    '1': 'checking if zip exists in db',
    '2a-1': 'zips not found. calling zip api',
    '2a-2': 'retrieved from api. storing in db',
    '2b': 'zips found. retrieving zip data',
    '3': 'using zips to retrieve venues from database',
    '4': 'venues found. looking for latest updates',
    '5': 'end'
  };
  this.current = 0;
};

Logger.constructor = Logger;

Logger.prototype.step = function(count) {
  console.log("Step " + count + ": " + this.messages[count]);
  this.current = count;
};

Logger.prototype.currentStep = function() {
  return this.current;
};

exports.Logger = new Logger();
