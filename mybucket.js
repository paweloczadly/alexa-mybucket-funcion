var alexa = require('alexa-app');

var app = new alexa.app('mybucket');

app.launch(function(req, res) {
  res.say('Hello from mybucket function! Please specify a bucket.');
});

app.intent('ReadIntent', {
    'slots': {
      'BUCKET': 'LIST_OF_BUCKETS'
    },
    'utterances': [
      'read the content of {-|BUCKET} bucket'
    ]
  },
  function(req, res) {
    var value = req.slot('BUCKET');
    res.say(`I am reading S3 bucket ${value}.`);
  }
);

module.exports = app;
