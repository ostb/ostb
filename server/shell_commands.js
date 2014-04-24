var sys = require('sys')
var exec = require('child_process').exec;

exports.createUser = function(username) {
  exec("mkdir ~/users/" + username, function (error, stdout, stderr) {
    sys.print('stdout: ' + stdout);
  });
}

exports.init = function(username, reponame) {
  exec("git init ~/users/" + username + "/" + reponame, function (error, stdout, stderr) {
    sys.print('stdout: ' + stdout);
  });
}
