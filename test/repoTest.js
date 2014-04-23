var mocha = require('mocha');
var should = require('should');
var fs = require('fs');
var Promise = require('bluebird');
var port = 3000;
var express = require('express');
var gitteh  = require("gitteh");

var app;

describe('undefined repo', function() {

  before(function(done) {
    app = express();
    app.listen(3000);

    gitteh.initRepository('./users/alejandroREAL/', false, function() {
      done();
    });
  });

  it('should return undefined for a non-existent repo', function(done) {
    gitteh.openRepository('./users/alejandroFAKE/', function(error, repo) {
      (typeof repo).should.equal('undefined');
      done();
    });
  });

  it('should retrieve a created repo', function(done) {
    gitteh.openRepository('./users/alejandroREAL/', function(error, repo) {
      (typeof repo).should.equal('object');
      done();
    });
  });
});



