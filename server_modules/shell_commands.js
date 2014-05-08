var sys = require('sys')
var exec = require('child_process').exec;
var fs = require('fs');
var Promise = require('bluebird');
var execute = Promise.promisify(exec);

exports.createUser = function(username, next) {
  if(!isLegalName(username)) {
    throw 'Illegal character in username. Please use only alphanumberic characters and spaces.';
  }
  username = username.trim();

  if(fs.existsSync('user_data/' + username)) {
    throw 'A user with that name already exists.'
  }
  execute('mkdir user_data/' + username)
  .then(function() {
    next();
  });
}

exports.init = function(username, repo, next) {
  if(!isLegalName(repo)) {
    throw 'Illegal character in project name. Please use only alphanumberic characters and spaces.';
  }
  repo = repo.trim();

  if(fs.existsSync('user_data/' + username + '/' + repo + '/')) {
    throw 'You already have a project named ' + repo + '!';
  }

  execute('git init user_data/' + username + '/' + repo + ' && ' +
          'cd user_data/' + username + '/' + repo + ' && ' +
          'git checkout -b contributions' + ' && ' +
          'git checkout -b master')
  .then(function() {
    var commitBody = {
      'content.md': '#Welcome\nThis is the first version of your new project.',
      'index.html': '<!DOCTYPE HTML>',
      'js/' : ''
    }
    var cmt = Promise.promisify(commit);
    return cmt(username, repo, 'Created new project ' + repo, commitBody, null);
  })
  .then(function(hash) {
    next(null, hash);
  })
}

var commit = exports.commit = function(username, repo, commitMessage, commitBody, branch, next) {
  if(!isLegalCommitMessage(commitMessage)) {
    throw 'Illegal character in version name. Please use only alphanumberic characters and spaces.';
  }

  for(var key in commitBody) {      //iterate through all file/dir changes and write to disk
    if(key[key.length - 1] === '/') {   //directory
      fs.mkdirSync('user_data/' + username + '/' + repo + '/' + key);
    }else {                             //file
      fs.writeFileSync('user_data/' + username + '/' + repo + '/' + key, commitBody[key]);
    }
  }

  var command = 'cd user_data/' + username + '/' + repo + ' && ' + 'git add --all' + ' && ';
  if(branch) {
    command += 'git checkout ' + branch + ' && '
  }
  command += 'git commit -m "' + commitMessage + '"'

  execute(command)
  .then(function() {
    return getCommitHash(username, repo, branch);
  })
  .then(function(hash) {
    next(null, hash[0].trim());
  })
}

var getCommitHash = exports.getCommitHash = function(username, repo, branch) {
  
  var command = 'cd user_data/' + username + '/' + repo + ' && '
  if(branch) {
    command += 'git checkout ' + branch + ' && '
  }
  command += 'git rev-parse HEAD'

  return execute(command);
}

exports.checkout = function(username, repo, hash, branch, next) {
  hash = hash || 'master';

  execute('cd user_data/' + username + '/' + repo + ' && ' +
          'git checkout ' + branch + ' && ' +
          'git checkout ' + hash)
  .then(function() {
    fs.readFile('user_data/' + username + '/' + repo + '/' + 'content.md', 'utf-8', function(err, data) {
      if(err){
        throw err;
      }
      next(null, data);
    });
  })
}

exports.clone = function(username, owner, repo, next) {
  execute('cd user_data/' + username + ' && ' + 'git clone ../' + owner + '/' + repo)
  .then(function() {
    return getCommitHash(owner, repo);
  })
  .then(function(hash) {
    next(null, hash[0].trim());
  })
}

exports.deleteRepo = function(username, repo) {
  return execute('rm -rf  user_data/' + username + '/' + repo);
}

exports.deleteUser = function(username) {
  return execute('rm -rf  user_data/' + username);
}

var isLegalName = function(name) {
  var regex = /^[\w\-]+$/;
  return regex.test(name);
}

var isLegalCommitMessage = function(name) {
  var regex = /^[\w\-\s]+$/;
  return regex.test(name);
}



