var express = require('express');
var share   = require('share');
var Q       = require('q');
var gitteh  = require("gitteh");

// var git  = require('nodegit');
// var open = require('nodegit').Repo.open;


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

  // gitteh.initRepository('./users/alejandro/', false, function(){
  //   console.log('repo create');
  // });

    gitteh.openRepository('./users/alejandro/', function(error, repo) {
      console.log('repo: ', repo);
    });

});

app.listen(3000);