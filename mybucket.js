var alexa = require('alexa-app');

var app = new alexa.app('mybucket');

app.launch(function(req, res) {
  res.say('Hello from mybucket function!');
});

module.exports = app;
