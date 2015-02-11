$(document).ready(function() {
  // TODO - validate time and location
  var venueType = $('#venueType');
  var time = $('#time');
  var location = $('#location');
  var submit = $('#submit');
  var server = 'http://127.0.0.1:3000';

  ///////////////////////////////////////////////////////
  // ajax request
  var killTime = function() {

    $.ajax({
      url: server,
      type: 'POST',
      data: JSON.stringify({
        "venueType": venueType.val(),
        "time": time.val(),
        "location": location.val()
      }),
      contentType: 'application/json',
      success: function(data) {
        console.log("success", data);
      },
      error: function(data) {
        console.log("error", data);
      }
    });
  };

  submit.click(function() {
    killTime();
  });
});
