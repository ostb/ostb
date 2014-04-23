var express = require('express');
var share = require('share');
// var hat = require('hat');
var git = require('nodegit');
var Q = require('q');

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
  console.log('received request');
  res.render('index');

  // var newRepo = new git.Repo.init('./users/alejandro/', false, function(error, Repo) {
  //   if (error) console.log(error);
  //   console.log('created repo ', Repo);
  // });

  git.Repo.open('./users/alejandro/', function(error, Repo) {
    if (error) console.log(error);
    console.log('retrieved repo ', Repo);
    
    Repo.createCommit('updateRef', 'author', 'committer', 'message', null, [], function(oid) {
      console.log('commit success: ', oid);
    });
  });

});

app.listen(3000);