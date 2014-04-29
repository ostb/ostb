var sys = require('sys')
var exec = require('child_process').exec;
var fs = require('fs');
var Promise = require('bluebird');
var execute = Promise.promisify(exec);

exports.createUser = function(username, next) {
  if(!isLegalName(username)) {
    throw 'Illegal character in username. Please use only alphanumberic characters and spaces.';
  }
  if(fs.existsSync('user_data/' + username)) {
    throw 'A user with that name already exists.'
  }
  execute('mkdir user_data/' + sanitizeSpaces(username))
  .then(function() {
    next();
  });
}

exports.init = function(username, repo, next) {
  if(!isLegalName(repo)) {
    throw 'Illegal character in project name. Please use only alphanumberic characters and spaces.';
  }
  if(fs.existsSync('user_data/' + username + '/' + repo.trim() + '/')) {
    throw 'You already have a project named ' + repo.trim() + '!';
  }
  execute('git init user_data/' + sanitizeSpaces(username) + '/' + sanitizeSpaces(repo))
  .then(function() {
    fs.writeFileSync('user_data/' + username + '/' + repo.trim() + '/' + 'content.md', '#Welcome\nThis is the first version of your new project.');
    fs.writeFileSync('user_data/' + username + '/' + repo.trim() + '/' + 'index.html', '');
    fs.mkdirSync('user_data/' + username + '/' + repo.trim() + '/' + 'js');
  })
  .then(function() {
    var cmt = Promise.promisify(commit);
    return cmt(username, repo, 'Created new project ' + repo);
  })
  .then(function() {
    next();
  })
}

var commit = exports.commit = function(username, repo, commitMessage, next) {
  if(!isLegalName(commitMessage)) {
    throw 'Illegal character in version name. Please use only alphanumberic characters and spaces.';
  }
  execute('cd user_data/' + sanitizeSpaces(username) + '/' + sanitizeSpaces(repo) + ' && ' + 'git add --all' + ' && ' + 'git commit -m "' + commitMessage +'"')
  .then(function() {
    return getCommitHash(username, repo);
  })
  .then(function(hash) {
    next(null, hash[0].trim());
  })
}

var getCommitHash = exports.getCommitHash = function(username, repo) {
  return execute('cd user_data/' + sanitizeSpaces(username) + '/' + sanitizeSpaces(repo) + ' && ' + 'git rev-parse HEAD');
}

exports.checkout = function(username, repo, hash) {
  hash = hash || 'master';
  return execute('cd user_data/' + sanitizeSpaces(username) + '/' + sanitizeSpaces(repo) + ' && ' + 'git checkout ' + hash);
}

exports.clone = function(username, owner, repo) {
  return execute('cd user_data/' + sanitizeSpaces(username) + ' && ' + 'git clone ../' + sanitizeSpaces(owner) + '/' + sanitizeSpaces(repo));
}

exports.deleteRepo = function(username, repo) {
  return execute('rm -rf  user_data/' + sanitizeSpaces(username) + '/' + sanitizeSpaces(repo));
}

exports.deleteUser = function(username) {
  return execute('rm -rf  user_data/' + sanitizeSpaces(username));
}

var sanitizeSpaces = function(input) {
  return input.trim().replace(/ /g, '\\ ');
}

var isLegalName = function(name) {
  var regex = /^[\w\-\s]+$/;
  return regex.test(name);
}




