var sys = require('sys')
var exec = require('child_process').exec;
var fs = require('fs');
var Promise = require('bluebird');
var execute = Promise.promisify(exec);

exports.createUser = function(username, next) {
  if(!isLegalName(username)) {
    throw 'Illegal character in username. Please use only alphanumberic characters and spaces.';
  }
  if(fs.existsSync('/Users/ethoreby/users/' + username)) {
    throw 'A user with that name already exists.'
  }
  execute('mkdir ~/users/' + sanitizeSpaces(username))
  .then(function() {
    next();
  });
}

exports.init = function(username, repo, next) {
  if(!isLegalName(repo)) {
    throw 'Illegal character in project name. Please use only alphanumberic characters and spaces.';
  }
  // return execute('git init ~/users/' + username + '/' + repo);
  execute('git init ~/users/' + sanitizeSpaces(username) + '/' + sanitizeSpaces(repo))
  .then(function() {
    fs.writeFileSync('/Users/ethoreby/users/' + username + '/' + repo.trim() + '/' + 'p1.txt', 'Welcome. This is the first version of your new project.');
  })
  .then(function() {
    var cmt = Promise.promisify(commit);
    return cmt(username, repo, 'Created new project ' + repo);
  }).then(function() {
    next();
  })
}

var commit = exports.commit = function(username, repo, commitMessage, next) {
  if(!isLegalName(commitMessage)) {
    throw 'Illegal character in version name. Please use only alphanumberic characters and spaces.';
  }
  execute('cd ~/users/' + sanitizeSpaces(username) + '/' + sanitizeSpaces(repo) + ' && ' + 'git add --all' + ' && ' + 'git commit -m "' + commitMessage +'"')
  .then(function() {
    next();
    // return getCommitHash(username, repo);
  })
}

var getCommitHash = exports.getCommitHash = function(username, repo) {
  return execute('cd ~/users/' + sanitizeSpaces(username) + '/' + sanitizeSpaces(repo) + ' && ' + 'git rev-parse HEAD');
}

// exports.fork = 
// exports.checkout = 

exports.deleteRepo = function(username, repo) {
  return execute('rm -rf  ~/users/' + sanitizeSpaces(username) + '/' + sanitizeSpaces(repo));
}

exports.deleteUser = function(username) {
  return execute('rm -rf  ~/users/' + sanitizeSpaces(username));
}

var sanitizeSpaces = function(input) {
  return input.trim().replace(/ /g, '\\ ');
}

var isLegalName = function(name) {
  var regex = /^[\w\-\s]+$/;
  return regex.test(name);
}




