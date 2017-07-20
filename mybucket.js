var alexa = require('alexa-app');
var app = new alexa.app('mybucket');

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

app.launch(function(req, res) {
  res.say('Hello from mybucket function! Please specify a bucket.');
});

app.intent('ReadIntent', {
    'slots': {
      'BUCKET': 'LIST_OF_BUCKETS',
      'OBJECT': 'LIST_OF_OBJECTS'
    },
    'utterances': [
      'read the content of {-|OBJECT}',
      'read the content of {-|OBJECT} from {-|BUCKET}'
    ]
  },
  function(req, res) {
    let key = req.slot('OBJECT')
    let bucket = req.slot('BUCKET')
    if (bucket == null) {
      let enteredValue = req.slot('OBJECT').split(' from ');  // temp workaround for two slots
      key = enteredValue[0];
      bucket = enteredValue[1] + "test-sandbox-bucket";
    }

    let params = {
      Bucket: bucket,
      Key: key
    };

    return new Promise((resolve, reject) => {
      s3.getObject(params, (err, data) => {
        let answer
        if (err) {
          answer = `There was a problem with reading the content of ${key} from ${bucket}`;
          console.log(bucket);
          console.log(answer);
          console.log(err, err.stack);
        } else {
          answer = data.Body.toString('ascii');
        }
        resolve(answer)
      });
    }).then((msg) => res.say(msg));
  }
);

app.intent('ListIntent', {
    'slots': {
      'BUCKET': 'LIST_OF_BUCKETS'
    },
    'utterances': [
      'list all files from {-|BUCKET}',
    ]
  },
  function(req, res, cb) {
    let bucket = req.slot('BUCKET');
    let params = {
      Bucket: bucket
    };

    return new Promise((resolve, reject) => {
      s3.listObjects(params, (err, data) => {
        let answer
        if (err) {
          answer = `There was a problem with listing ${bucket}.`;
          console.log(err, err.stack);
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
