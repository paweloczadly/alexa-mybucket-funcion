var express = require('express');
var request = require('supertest');
var chai = require('chai');
var expect = chai.expect;

describe('My Bucket', function() {
  var server;

  beforeEach(function() {
    var app = express();
    var mybucket = require('../mybucket');
    mybucket.express({
      expressApp: app,
      debug: true,
      checkCert: false
    });
    server = app.listen(3000);
  });

  it('responds to invalid data', function() {
    return request(server)
      .post('/mybucket')
      .send({})
      .expect(200).then(function(response) {
        return expect(response.body).to.eql({
          version: '1.0',
          response: {
            directives: [],
            shouldEndSession: true,
            outputSpeech: {
              type: 'SSML',
              ssml: '<speak>Error: not a valid request</speak>'
            }
          },
          sessionAttributes: {}
        });
      });
  });

  it('responds to a launch event', function() {
    return request(server)
      .post('/mybucket')
      .send({
        request: {
          type: 'LaunchRequest',
        }
      })
      .expect(200).then(function(response) {
        var ssml = response.body.response.outputSpeech.ssml;
        return expect(ssml).to.eql('<speak>Hello from mybucket function! Please specify a bucket.</speak>');
      });
  });

  it('responds to a read event', function() {
    return request(server)
      .post('/mybucket')
      .send({
        request: {
          type: 'IntentRequest',
          intent: {
            name: 'ReadIntent',
            slots: {
              BUCKET: {
                name: "BUCKET",
                value: "red"
              },
              OBJECT: {
                name: "OBJECT",
                value: "test"
              }
            }
          }
        }
      })
      .expect(200).then(function(response) {
        console.log(response.body.response);
        var ssml = response.body.response.outputSpeech.ssml;
        return expect(ssml).to.eql('<speak>It is my private S3 bucket</speak>');
      });
  });

  it('responds to a list event', function() {
    return request(server)
      .post('/mybucket')
      .send({
        request: {
          type: 'IntentRequest',
          intent: {
            name: 'ListIntent',
            slots: {
              BUCKET: {
                name: "BUCKET",
                value: "red"
              }
            }
          }
        }
      })
      .expect(200).then(function(response) {
        console.log(response.body.response);
        var ssml = response.body.response.outputSpeech.ssml;
        return expect(ssml).to.eql('<speak>Here are your files in S3 bucket a-test-sandbox-bucket: test</speak>');
      });
  });

  afterEach(function() {
    server.close();
  });
});
