var express = require('express');
var share = require('share');
// var hat = require('hat');
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
  res.render('index');
});

app.listen(3000);