var express = require('express');
var share   = require('share');
var Promise = require('bluebird');
var shell = require('./server_modules/shell_commands');


var app = express();

app.set('views', __dirname + '/client/views');
app.set('view engine', 'ejs');
// app.use(express.static(__dirname + '/views'));

var options = {
  db: {type: 'none'},
  browserChannel: {cors: '*'},
  // auth: function(client, action) {}
}
share.server.attach(app, options);

// var example = require('git-node/examples/create');
// var example = require('git-node/examples/read');

// shell.createUser('alejandro sanchez')
// .then(function(stdout) {
//   console.log('stdout: ' + stdout);
// })
// .catch(function(err){
//   console.log('error: ', err);
// });

shell.init('alejandro sanchez', 'intro_biology')
.then(function(stdout) {
  console.log('stdout: ' + stdout);
})
.catch(function(err){
  console.log('error: ', err);
});

// shell.deleteRepo('alejandro', 'intro_biology')
// .then(function(stdout) {
//   console.log('stdout: ' + stdout);
// })
// .catch(function(err){
//   console.log('error: ', err);
// });

// shell.commit('alejandro', 'intro_biology', 'test commit');

// shell.log('alejandro', 'intro_biology');

// shell.getCommitHash('alejandro', 'intro_biology')
// .then(function(hash) {
//   console.log('commit hash: ', hash[0]);
// });


app.get('/', function(req, res) {
  console.log('received request');
  res.render('index');
});

app.listen(3000);
