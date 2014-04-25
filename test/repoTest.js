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

  });

  after(function() {
    fs.rmdir('/Users/ethoreby/users/alejandroTest');
  })

  it('should create a user directory', function(done) {
    shell.createUser('alejandroTest').then(function() {
      (fs.existsSync('/Users/ethoreby/users/alejandroTest')).should.equal(true);
      done();
    });
  });

  it('should retrieve a created repo', function() {
    gitteh.openRepository('./users/alejandroREAL/', function(error, repo) {
      (typeof repo).should.equal('object');
      done();
    });
  });
});



