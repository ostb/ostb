var Promise = require('bluebird');
var shell = require('./../shell_commands');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');

var validPassword = function(password, hash) {
  return bcrypt.compareSync(password, hash);
};

var generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

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
  console.log('req.session', req.session);
  console.log('req.session.user', req.session.user);

  var collection = db.get('usercollection');
    collection.findOne({
      username: req.body.username
    }).on('success', function(data){
      console.log('data', data);
      if(data){
        if(validPassword(req.body.password, data.pwHash)){
          req.session.user = req.body.username;
          res.send(201);
        }else{
          req.session.user = undefined;
          res.send(401);
        }
        console.log('req.session.user', req.session.user);
        console.log('req.session', req.session);
      }
    });
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

