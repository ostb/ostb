var express = require('express');
var share = require('share');
var showdown = require('showdown');
var Promise = require('bluebird');
var shell = require('./server_modules/shell_commands');
var app = express();

//adrian
var converter = new showdown.converter();

var Mustache = (function() {
  try {
    return require('mustache');
  } catch (_error) {
    e = _error;
    return {
      to_html: function() {
        return "<body><pre>% npm install mustache</pre> to use this demo.";
      }
    };
  }
})();

var render = function(content, name, docName, res) {
  var html, markdown;
  markdown = showdown.makeHtml(content);
  html = Mustache.to_html(template, {
    content: content,
    markdown: markdown,
    name: name,
    docName: docName
  });
  res.writeHead(200, {
    'content-type': 'text/html'
  });
  return res.end(html);
};

module.exports = function(docName, model, res) {
  var name;
  name = docName;
  docName = "wiki:" + docName;
  return model.getSnapshot(docName, function(error, data) {
    if (error === 'Document does not exist') {
      return model.create(docName, 'text', function() {
        var content;
        content = defaultContent(name);
        return model.applyOp(docName, {
          op: [
            {
              i: content,
              p: 0
            }
          ],
          v: 0
        }, function() {
          return render(content, name, docName, res);
        });
      });
    } else {
      return render(data.snapshot, name, docName, res);
    }
  });
};



app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

var options = {
  db: {type: 'none'}
  // auth: function(client, action) {}
}
share.server.attach(app, options);


var newUser = Promise.promisify(shell.createUser);
// shell.deleteUser('alejandro sanchez')
// .then(function() {
  newUser('alejandro sanchez')
  .then(function() {
    console.log('created a user')
  })
  .catch(function(err){
    console.log(err);
  })
// })

// shell.init('alejandro sanchez', 'intro biology')
// .then(function(stdout) {
//   console.log('stdout: ' + stdout);
// })
// .catch(function(err){
//   console.log('error: ', err);
// });

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
