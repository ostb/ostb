var mocha = require('mocha');
var should = require('should');
var fs = require('fs');
var Promise = require('bluebird');
var port = 3000;
var express = require('express');
var shell = require('../server_modules/shell_commands');

var app;
var origHash;

describe('repo & user testing', function() {

  before(function() {
    app = express();
    app.listen(3000);
    fs.exists('user_data/', function(exists) {
      if(!exists) {
        fs.mkdirSync('user_data');
      }
    });
  });

  after(function(done) {
    shell.deleteUser('alejandroTest')
    .then(function() {
      return shell.deleteUser('elliottTest');
    })
    .then(function() {
      done();
    })
    .catch(function(err){
      console.log(err);
    });
  })

  it('should create a user directory', function(done) {
    var newUser = Promise.promisify(shell.createUser);
    newUser('alejandroTEST')
    .then(function(stdout) {
      (fs.existsSync('user_data/alejandroTest')).should.equal(true);
      done();
    })
    .catch(function(err){
      console.log(err);
    })
  });

  it('should initialize a repo', function(done) {
    var newRepo = Promise.promisify(shell.init);
    newRepo('alejandroTest', 'test_repo')
    .then(function() {
      (fs.existsSync('user_data/alejandroTest/test_repo')).should.equal(true);
      done();
    })
    .catch(function(err){
      console.log(err);
    })
  });

  it('should create an initial commit', function(done) {
    shell.getCommitHash('alejandroTest', 'test_repo')
    .then(function(hash) {
      (hash.length > 0).should.equal(true);
      origHash = hash;
      done();
    })
    .catch(function(err){
      console.log(err);
    })
  });

  it('should commit file changes', function(done) {
    fs.writeFileSync('user_data/alejandroTest/test_repo/content.md', 'Changes to the file.');

    var commitBody = {
      'content.md': 'Changes to the file.',
    }

    var cmt = Promise.promisify(shell.commit);
    cmt('alejandroTest', 'test_repo', 'second commit', commitBody)
    .then(function(hash){
      (hash.length > 0).should.equal(true);
      done();
    })
    .catch(function(err){
      console.log(err);
    })
  });

  it('should not allow white space in inputs', function(done) {
    var newRepo = Promise.promisify(shell.init);
    newRepo('alejandroTest', ' test repo ')
    .then(function() {
      (true).should.equal(false);     //should not execute .then
      done();
    })
    .catch(function(err){
      (typeof err).should.not.equal('undefined');
      done();
    })
  });

  it('should throw an error for inputs with illegal characters', function(done) {
    var newRepo = Promise.promisify(shell.init);
    newRepo('alejandroTest', 'test_repo_!!!OMG!?@$!')
    .then(function() {
      (true).should.equal(false);     //should not execute .then
      done();
    })
    .catch(function(err){
      (typeof err).should.not.equal('undefined');
      done();
    })
  });

  it('should checkout versions', function(done) {
    var checkout = Promise.promisify(shell.checkout);

    checkout('alejandroTest', 'test_repo', null)
    .then(function(data) {
      console.log('data: ', data);
      data.should.equal('Changes to the file.');
      done();
    })
    .catch(function(err){
      console.log(err, arguments);    //detached HEAD warning proceeds here.
    })
  });

  it('should clone a project to another user directory', function(done) {
    var newUser = Promise.promisify(shell.createUser);
    var copy = Promise.promisify(shell.clone);
    newUser('elliottTest')
    .then(function() {
      return copy('elliottTest', 'alejandroTest', 'test_repo')
    })
    .then(function() {
      (fs.existsSync('user_data/elliottTest/test_repo')).should.equal(true);
      done();
    })
    .catch(function(err) {
      console.log(err);
    })
  });
});



