var express = require('express');
var share   = require('share');
var Promise = require('bluebird');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// app.use(express.static(__dirname + '/views'));

var options = {
  db: {type: 'none'},
  browserChannel: {cors: '*'},
  // auth: function(client, action) {}
}
share.server.attach(app, options);


var sys = require('sys')
var exec = require('child_process').exec;
var child;
 
// executes `pwd`
// child = exec("pwd", function (error, stdout, stderr) {
//   sys.print('stdout: ' + stdout);
//   sys.print('stderr: ' + stderr);
//   if (error !== null) {
//     console.log('exec error: ' + error);
//   }
// });

// exec("git init ~/users/" + "alejandro" + "/" + "intro_biology", function (error, stdout, stderr) {
//   sys.print('stdout: ' + stdout);
// });

// exec("cd ~/users/" + "alejandro" + "/" + "intro_biology" + "&& git add --all && git commit", function (error, stdout, stderr) {
//   sys.print('stdout: ' + stdout);
// });

app.get('/', function(req, res) {
  console.log('received request');
  res.render('index');
});

app.listen(3000);
