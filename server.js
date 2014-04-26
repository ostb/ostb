var express = require('express');
var share = require('share');
// var hat = require('hat');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

var options = {
  db: {type: 'none'}
  // browserChannel: {cors: '*'},
  // auth: function(client, action) {}
}
share.server.attach(app, options);

app.get('/', function(req, res) {
  console.log('recieved request');
  res.render('index');
});

// app.get('/lib/ace/ace.js', function(req, res) {
//   // // res.set('Content-Type', 'text/javascript');
//   // // res.sendfile('/lib/ace/ace');
//   // res.sendfile('index');
//   res.send('ace');
// });

app.listen(3000);
