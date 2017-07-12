var alexa = require('alexa-app');
var app = new alexa.app('mybucket');

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

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

app.intent('ListIntent', {
    'slots': {
      'BUCKET': 'LIST_OF_BUCKETS'
    },
    'utterances': [
      'list all files from {-|BUCKET} bucket'
    ]
  },
  function(req, res) {
    var value = req.slot('BUCKET')
    var params = {
      Bucket: value
    };
    // default answer:
    var answer = `Please check if you have proper access rights to S3 bucket ${value}.`

    s3.listObjects(params, function(err, data) {
      answer = "dupa"
      if (err) {
        answer = `There was a problem with listing ${value}.`
      }
      else {
        answer = `Here are your files in S3 bucket ${value}:`;
        data.Contents.forEach(function(elem) {
          res.say(elem.Key)
        });
      }
    });
    res.say(answer)
  }
);

module.exports = app;
