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
    fs.rmdirSync('/Users/ethoreby/users/alejandroTest/test_repo');
    fs.rmdirSync('/Users/ethoreby/users/alejandroTest');
  })

  it('should create a user directory', function(done) {
    shell.createUser('alejandroTest').then(function() {
      (fs.existsSync('/Users/ethoreby/users/alejandroTest')).should.equal(true);
      done();
    });
  });

  it('should initialize a repo', function(done) {
    shell.init('alejandroTest', 'test_repo')
    .then(function() {
      (fs.existsSync('/Users/ethoreby/users/alejandroTest/test_repo')).should.equal(true);
      done();
    })
  });
});



