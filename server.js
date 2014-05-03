var express = require('express');
var share = require('share');
var showdown = require('showdown');
var Promise = require('bluebird');
var shell = require('./server_modules/shell_commands');
var bodyParser = require('body-parser');
var fs = require('fs');


//30aprAdrian
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var cookieParser = require('cookie-parser');


var users = require('./server_modules/controllers/users');
var projects = require('./server_modules/controllers/projects');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/userdb');

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

app.use(function(req,res,next){
  req.db = db;
  next();
});

var options = {
  db: {type: 'none'}
  // auth: function(client, action) {}
}
share.server.attach(app, options);


// ----- ROUTING -----
// ----- webpage requests -----
app.get('/editor', function(req, res) {
  res.render('editor');
});

app.get('/navbar', function(req, res) {
  res.render('navbar');
});

app.get('/', function(req, res) {
  res.render('index');
});

// ----- api requests -----
app.route('/api/users')
.post(users.create)
.delete(users.delete);

app.route('/api/projects')
.post(projects.create)
.delete(projects.delete)
.get(projects.getProjects);

app.route('/api/projects/clone')
.post(projects.clone);

app.route('/api/projects/commit')
.post(projects.commit)
.get(projects.getVersions);

app.route('/api/projects/checkout')
.get(projects.getFile);




//30aprAdrian setup passport config
app.use(cookieParser());
app.use(session({ secret: 'ostbRules' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); 

// app.post('/login', passport.authenticate('local'), function(req, res) {
//     var user = {};
//     user.email = req.user.email;
//     user.phone = req.user.phone;
//     user.display_name = req.user.display_name;
//     user.upcomingGames = req.user.upcomingGames;
//     user.gamesPlayed = req.user.gamesPlayed;
//     user.id = req.user._id;
//     res.json(user);
// });

app.get('/login', function(req, res) {
    res.render('login');
});

app.get('/logout', function(req, res) {
    req.logout();
    res.json(200, 'Logged Out');
});

app.get('/signup',function(req, res) {
  res.render('signup');
});


//2mayAdrian
passport.serializeUser(function(user, done) {
  console.log('User serialize');
  console.log(user);  
  console.log(user.email);
  done(null, user.email);
});

passport.deserializeUser(function(email, done) {
  console.log('User deserialize');
  User.findOne({email: email}, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(req, email, password, done) {

    process.nextTick(function(){
      users.findOne({'local.email' : email}, function(err, user){
        if(err){
          return done(err);
        }
        if(user){
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          users.create(req.body);
        }
      });
    });
  })
    // users.login(username, password, function(err, user) {
    //   //console.log('*****', err, user);
    //   return done(null, user);
    // });
);


app.listen(3000);

