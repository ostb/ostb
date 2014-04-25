var sys = require('sys')
var exec = require('child_process').exec;
var Promise = require('bluebird');
var execute = Promise.promisify(exec);

exports.createUser = function(username) {
  // exec('mkdir ~/users/' + username, function (error, stdout, stderr) {
  //   sys.print('stdout: ' + stdout);
  // });
  
  return execute('mkdir ~/users/' + username);
}

exports.init = function(username, repo) {
  // exec('git init ~/users/' + username + '/' + repo, function (error, stdout, stderr) {
  //   sys.print('stdout: ' + stdout);
  // });
  
  return execute('git init ~/users/' + username + '/' + repo);
}

exports.commit = function(username, repo, commitMessage) {
  exec('cd ~/users/' + username + '/' + repo + ' && ' + 'git add --all' + ' && ' + 'git commit -m "' + commitMessage +'"', function (error, stdout, stderr) {
    sys.print('stdout: ' + stdout);
  });
}

exports.log = function(username, repo) {
  exec('cd ~/users/' + username + '/' + repo + ' && ' + 'git log', function (error, stdout, stderr) {
    sys.print('stdout: ' + stdout + stderr);
  });
}