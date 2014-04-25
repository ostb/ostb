var sys = require('sys')
var exec = require('child_process').exec;

exports.createUser = function(username) {
  exec('mkdir ~/users/' + username, function (error, stdout, stderr) {
    sys.print('stdout: ' + stdout);
  });
}

exports.init = function(username, repo) {
  exec('git init ~/users/' + username + '/' + repo, function (error, stdout, stderr) {
    sys.print('stdout: ' + stdout);
  });
}

exports.commit = function(username, repo, commitMessage) {
  exec('cd ~/users/' + username + '/' + repo + ' && ' + 'git add --all' + ' && ' + 'git commit -m "' + commitMessage +'"', function (error, stdout, stderr) {
    sys.print('stdout: ' + stdout);
  });
}
