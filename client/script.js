$(document).ready(function() {
  var app;
  // todo - validate time and location
  var time = $('#time');
  var location = $('#location');
  var submit = $('#submit');

  app = {
    server: 'http://127.0.0.1:3000',

    killTime: function() {
      $.ajax({
        url: this.server,
        type: 'POST',
        data: JSON.stringify({"time": time.val(), "location": location.val()}),
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
