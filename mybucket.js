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
  function(req, res, cb) {
    let bucket = req.slot('BUCKET')
    let params = {
      Bucket: bucket
    };

    return new Promise((resolve, reject) => {
      s3.listObjects(params, (err, data) => {
        let answer
        if (err) {
          answer = `There was a problem with listing ${bucket}.`;
          console.log(err, err.stack)
        }
        else {
          answer = `Here are your files in S3 bucket ${bucket}:`;
          data.Contents.forEach((elem) => answer += ` ${elem.Key}`);
        }
        resolve(answer)
      });
    }).then((msg) => res.say(msg));
  }
);

module.exports = app;
