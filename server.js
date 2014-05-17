var express = require('express');
var share = require('share');
var showdown = require('showdown');
var Promise = require('bluebird');
var shell = require('./server_modules/shell_commands');
var bodyParser = require('body-parser');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var users = require('./server_modules/controllers/users');
var projects = require('./server_modules/controllers/projects');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/userdb');

var collection = db.get('usercollection');

var app = express();

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

//initialize users dir
fs.exists('user_data/', function(exists) {
  if(!exists) {
    fs.mkdirSync('user_data');
  }
})

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());

app.use(cookieParser());
app.use(session({ secret: 'ostbRules' }));


app.use(function(req,res,next){
  req.db = db;
  next();
});

var options = {
  db: {type: 'none'}
}
share.server.attach(app, options);


app.get('/', function(req, res) {
  res.render('index');
});

app.route('/api/users')
.post(users.updateUser)
.delete(users.delete)
.get(users.getUser);

app.route('/api/projects')
.post(projects.create)
.delete(projects.delete)
.get(projects.getProjects);

app.route('/api/projects/clone')
.post(projects.clone);

app.route('/api/projects/commit')
.post(projects.commit)
.delete(projects.removeContribution)
.get(projects.getVersions);

app.route('/api/projects/checkout')
.get(projects.getFile);

app.route('/auth/signup')
.post(users.signup);

app.route('/api/projects/download')
.get(projects.getFolder);

app.route('/api/projects/member')
.post(projects.addMember)
.delete(projects.deleteMember)
.get(projects.getMembers);

app.route('/search/:name')
.get(users.searchUser);

app.route('/auth/login')
.post(users.login);

app.route('/auth/current')
.get(users.getCurrent);

app.route('/logout')
.get(users.logout)

app.listen(3000);
