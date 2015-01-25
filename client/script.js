$(document).ready(function() {
  var app;
  // TODO - validate time and location
  var venueType = $('#venueType');
  var time = $('#time');
  var location = $('#location');
  var submit = $('#submit');

  ///////////////////////////////////////////////////////
  // ajax request
  app = {
    server: 'http://127.0.0.1:3000',

    killTime: function() {
      $.ajax({
        url: this.server,
        type: 'POST',
        data: JSON.stringify({"type": venueType.val(),
          "time": time.val(), "location": location.val()}),
        contentType: 'application/json',
        success: function(data) {
          console.log("success", data);
        },
        error: function(data) {
          console.log("error", data);
        }
      });
    }
  };

  submit.click(function() {
    app.killTime();
  })
});
