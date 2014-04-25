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

  after(function(done) {
    shell.deleteRepo('alejandroTest', 'test_repo')
    .then(function(stdout) {
      fs.rmdirSync('/Users/ethoreby/users/alejandroTest');
      done();
    })
    .catch(function(err){
      console.log('error: ', err);
    });
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

  it('should create an initial commit', function(done) {
    shell.getCommitHash('alejandroTest', 'test_repo')
    .then(function(hash) {
      (hash[0].length > 0).should.equal(true);
      done();
    })
  })
});



