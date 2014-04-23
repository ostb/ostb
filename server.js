var express = require('express');
var share = require('share');
// var hat = require('hat');
var git = require('nodegit');
var Promise = require('bluebird');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var options = {
  db: {type: 'none'},
  browserChannel: {cors: '*'},
  // auth: function(client, action) {}
}
share.server.attach(app, options);

app.get('/', function(req, res) {
  console.log('recieved request');
  res.render('index');

  console.log('git', git);

  var newRepo = new git.Repo.init('./users/alejandro/', false, function(error, Repo) {
    if (error) console.log(error);
    console.log('created repo ', Repo);
  });

  
});

app.listen(3000);