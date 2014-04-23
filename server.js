var express = require('express');
var share = require('share');
// var hat = require('hat');
var git = require('nodegit');
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

  var newRepo = new git.raw.Repo();
  console.log(newRepo);

  newRepo.init('./users/alejandro/', false, function(error, Repo) {
    if (error) console.log(error);
    console.log('created repo ', Repo);
  });
});

  // git.repo('./users/alejandro/.git', function(error, repository) {
  //   if (error) throw error;
  //   console.log('retrieve repo: ', repository);

  //   repository.init('./users/alejandro/', false, function(error, data) {
  //     if (error) throw error;
  //     console.log('created repo ', data);

  //     git.repo('./users/alejandro/.git', function(error, repository) {
  //       if (error) throw error;
  //       console.log('user repo: ', repository);
  //     });
  //   });
    
  // });

// });

app.listen(3000);