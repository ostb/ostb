var mocha = require('mocha');
var should = require('should');
var fs = require('fs');
var Promise = require('bluebird');
var port = 3000;
var express = require('express');
var shell = require('../server_modules/shell_commands');

var app;

describe('repo & user testing', function() {

  before(function() {
    app = express();
    app.listen(3000);

    fs.mkdirSync('testUsers/');

  });

  after(function() {
    fs.rmdir('testUsers/');
  })

  it('should return null for a non-existent repo', function(done) {
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



