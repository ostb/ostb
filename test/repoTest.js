var mocha = require('mocha');
var should = require('should');
var fs = require('fs');
var Promise = require('bluebird');
var port = 3000;
var express = require('express');
var git = require('nodegit');
var app;

describe('undefined repo', function() {

  before(function(done) {
    app = express();
    app.listen(3000);

    var newRepo = new git.Repo.init('./users/alejandroREAL/', false, function(error, Repo) {
      done();
    });
  });

  it('should return undefined for a non-existent repo', function(done) {
    git.Repo.open('./users/alejandroFAKE/', function(error, repo) {
      (typeof repo).should.equal('undefined');
      done();
    });
  });

  it('should retrieve a created repo', function(done) {
    git.Repo.open('./users/alejandroREAL/', function(error, repo) {
      (typeof repo).should.equal('object');
      done();
    });
  });
});



