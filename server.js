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


var sys = require('sys')
var exec = require('child_process').exec;
var child;

// shell.init('alejandro', 'intro_biology');
// shell.createUser('elliott');
// shell.commit('alejandro', 'intro_biology', 'test commit');

// var walk = require('./server_modules/walk');

app.get('/', function(req, res) {
  console.log('received request');
  res.render('index');
});

app.listen(3000);
