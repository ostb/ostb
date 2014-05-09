var sys = require('sys')
var exec = require('child_process').exec;
var fs = require('fs');
var ncp = require('ncp').ncp;
var Promise = require('bluebird');
var execute = Promise.promisify(exec);

ncp.limit = 16;

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
  var savedHash;

  if(!isLegalName(repo)) {
    throw 'Illegal character in project name. Please use only alphanumberic characters and spaces.';
  }
  repo = repo.trim();

  if(fs.existsSync('user_data/' + username + '/' + repo + '/')) {
    throw 'You already have a project named ' + repo + '!';
  }

  execute('git init user_data/' + username + '/' + repo)
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
    savedHash = hash;
    return execute('cd user_data/' + username + '/' + repo + ' && ' +
                   'git branch contributions')
  })
  .then(function() {
    next(null, savedHash);
  })
}

var commit = exports.commit = function(username, repo, commitMessage, commitBody, branch, next) {
  if(!isLegalCommitMessage(commitMessage)) {
    throw 'Illegal character in version name. Please use only alphanumberic characters and spaces.';
  }

  var buildDir = function() {
    for(var key in commitBody) {      //iterate through all file/dir changes and write to disk
      if(key[key.length - 1] === '/') {   //directory
        fs.mkdirSync('user_data/' + username + '/' + repo + '/' + key);
      }else {                             //file
        fs.writeFileSync('user_data/' + username + '/' + repo + '/' + key, commitBody[key]);
      }
    }
  }

  if(branch){
    branch = ' && git checkout ' + branch;
  }else {
    branch = '';
  }
  var branchCmd = 'cd user_data/' + username + '/' + repo + 
                  branch;
  var command = 'cd user_data/' + username + '/' + repo + ' && ' + 'git add --all' + ' && ' + 
                'git commit -m "' + commitMessage + '"'

  execute(branchCmd)
  .then(function() {
    buildDir();
    return execute(command)
  })
  .then(function() {
    return getCommitHash(username, repo);
  })
  .then(function(hash) {
    next(null, hash[0].trim());
  })
}

var getCommitHash = exports.getCommitHash = function(username, repo) {
  
  var command = 'cd user_data/' + username + '/' + repo + ' && ' + 'git rev-parse HEAD'

  return execute(command);
}

exports.checkout = function(username, repo, hash, branch, next) {
  hash = hash || 'master';

  console.log('cd user_data/' + username + '/' + repo + ' && ' + 'git checkout ' + hash)

  execute('cd user_data/' + username + '/' + repo + ' && ' +
          // 'git checkout ' + branch + ' && ' +
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
  var copy = Promise.promisify(ncp);

  switchToMaster(owner, repo)
  .then(function() {
    fs.mkdirSync('user_data/' + username + '/' + repo);
    return copy('user_data/' + owner + '/' + repo, 'user_data/' + username + '/' + repo)
  })

  // var savedHash;

  // switchToMaster(owner, repo)
  // .then(function() {
  //   console.log('cd user_data/' + username + ' && ' + 'git clone ../' + owner + '/' + repo)
  //   return execute('cd user_data/' + username + ' && ' + 'git clone ../' + owner + '/' + repo)
  // })
  // .then(function() {
  //   return getCommitHash(owner, repo);
  // })
  // .then(function(hash) {
  //   savedHash = hash;
  //   return execute('cd user_data/' + username + '/' + repo + ' && ' +
  //                  'git branch contributions')
  // })
  // .then(function() {
  //   next(null, savedHash);
  // })


}

var switchToMaster = exports.switchToMaster = function(username, repo) {
  var command = 'cd user_data/' + username + '/' + repo + ' && ' +
                'git checkout master';
  return execute(command);
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



