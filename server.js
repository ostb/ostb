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

//30aprAdrian setup passport config
app.use(cookieParser());
app.use(session({ secret: 'ostbRules' })); // session secret


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
// app.get('/editor', function(req, res) {
//   res.render('editor');
// });

// app.get('/navbar', function(req, res) {
//   res.render('navbar');
// });

app.get('/', function(req, res) {
  // checkUser(req, res);
  res.render('index');
});

// ----- api requests -----
// app.route('/api/users')
// .post(users.create)
// .delete(users.delete);

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

app.route('/auth/signup')
.post(users.signup);

app.route('/auth/login')
.post(users.login);
// .all(function(req, res) {
//   checkUser(req, res);
//   res.render('index');
// });
// .get(users.currentUser);
// passport.authenticate('local')


// app.post('/auth/login', function(req, res){
//   var user = {};
//   user.email = req.user.email;
//   user.id = req.user._id;
//   res.json(user);
// });

// function checkUser(req, res, next){
//   console.log('req!!!', req);
//   if(!req.session.user){
//     console.log('not logged in');
//   }else{
//     next();
//   }
// };

// app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions
// app.use(flash()); 

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

// app.post('/login', passport.authenticate('local-login', {
//   successRedirect : '/profile',
//   failureRedirect : '/login',
//   failureFlash: true
// }));


// app.get('/login', function(req, res) {
//     res.render('/login');
// });

// var partials = function(req, res){
// var filename = req.params.filename;
//   if(!filename) return;  // might want to change this
//   res.render("/" + filename );
// };

// app.get('/:filename', partials);


//2mayAdrian
// app.post('/login', passport.authenticate('local-login',{
//   successRedirect : '/',
//   failureRedirect : '/login',
//   failureFlash : true
// }));

// app.get('/logout', function(req, res) {
//     req.logout();
//     res.json(200, 'Logged Out');
// });

// app.get('/signup',function(req, res) {
//   res.render('signup');
// });


//2mayAdrian
// passport.serializeUser(function(user, done) {
//   console.log('User serialize');
//   console.log(user);  
//   console.log(user.email);
//   done(null, user.email);
// });

// passport.deserializeUser(function(email, done) {
//   console.log('User deserialize');
//   collection.findOne({email: email}, function (err, user) {
//     done(err, user);
//   });
// });

// passport.use(new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password'
//   },
//   function(req, username, password, done) {
//     collection.findOne({'local.username' : username}, function(err, user) {
//       //console.log('*****', err, user);
//       if(err){
//         return done(err);
//       }
//       if(!user){
//         return done(null, false, req.flash('loginMessage', 'No user found.'));
//       }
//       if(!user.validPassword(password)){
//         return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
//       }
//       return done(null, user);
//     });
//   })
// );

// passport.use('local-login', new LocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password'
// },
//   function(req, email, password, done) {

//     users.findOne({'local.email' : email}, function(err, user){
//       if(err){
//         return done(err);
//       }
//       if(!user){
//         return done(null, false, req.flash('loginMessage', 'No user found.'));
//       } 
//       if(!users.validPassword(password)){
//         return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
//       }
//       return done(null, user);
//     });
//   })
//     // users.login(username, password, function(err, user) {
//     //   //console.log('*****', err, user);
//     //   return done(null, user);
//     // });
// );

// app.use(function (req, res, next) {
//   // check if client sent cookie
//   var cookie = req.cookies.loggedIn;
//   if (cookie === undefined)
//   {
//     res.cookie('loggedIn', false, {maxAge: 900000, httpOnly: true});
//     //res.cookie('cookieName',randomNumber, { maxAge: 900000, httpOnly: true });
//     console.log('cookie have created successfully');
//   } 
//   else
//   {
//     // yes, cookie was already present 
//     if(cookie === true){
//       res.cookie('loggedIn', hashedUsername, {maxAge: 900000, httpOnly: true});
//       console.log('cookie exists', cookie);
//     }
//     console.log('cookie exists', cookie);
//   } 
//   next(); // <-- important!
// });

app.listen(3000);
