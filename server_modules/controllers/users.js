var Promise = require('bluebird');
var shell = require('./../shell_commands');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');

// exports.generateHash = function(password) {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

exports.validPassword = function(password, hash) {
  return bcrypt.compareSync(password, hash);
};

var validPassword = function(password, hash) {
  return bcrypt.compareSync(password, hash);
};

var generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
// exports.signup = function(req, res){
//   console.log('req!!! : ', req);
//   console.log('res!!! : ', res);
//   passport.authenticate( {
//   // successRedirect : '/profile', // redirect to the secure profile section
//   // failureRedirect : '/signup', // redirect back to the signup page if there is an error
//     failureFlash : true // allow flash messages
//   });
// };


exports.signup = function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');

  var newUser = Promise.promisify(shell.createUser);
  newUser(req.body.username)
  .then(function() {
    console.log('created user ', req.body.username);

    collection.insert({
      username: req.body.username,
      meta: {},
      // email: '',
      // pwHash: '',

      //2MayAdrian
      email: req.body.email,
      pwHash: generateHash(req.body.password)
    });

    res.send(201);
  })
  .catch(function(err){
    res.send(400, err.toString());
  })
};

exports.login = function(req, res) {
  console.log('hit users js loggin');
  var db = req.db;
  // req.session.user_id = req.body.username;
  // console.log('req.session', req.session);

  var collection = db.get('usercollection');
    collection.findOne({
      username: req.body.username
    }).on('success', function(data){
      console.log('data', data);
      if(data){
        validPassword(req.body.password, data.pwHash);  
        console.log('validPassword', validPassword(req.body.password, data.pwHash));
      }
    });
    res.send(201);
  // })
  // .catch(function(err){
  //   res.send(400, err.toString());
  // })
};

exports.delete = function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  var projCollection = db.get('projectcollection');

  shell.deleteUser(req.query.username)
  .then(function() {
    console.log('deleted user ', req.query.username);

    collection.remove({username: req.query.username});
    projCollection.remove({username: req.query.username});
    
    res.send(204);
  })
  .catch(function(err){
    console.log(err);
    res.send(400, err.toString());
  });
}

