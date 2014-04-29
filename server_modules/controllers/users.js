var Promise = require('bluebird');
var shell = require('./../shell_commands');
var bodyParser = require('body-parser');

exports.create = function(req, res) {
  var newUser = Promise.promisify(shell.createUser);
  newUser(req.body.username)
  .then(function() {
    console.log('created user ', req.body.username);
    res.send(201);
  })
  .catch(function(err){
    res.send(400, err.toString());
  })
}

exports.delete = function(req, res) {
  shell.deleteUser(req.query.username)
  .then(function() {
    console.log('deleted user ', req.query.username);
    res.send(204);
  })
  .catch(function(err){
    console.log(err);
    res.send(400, err.toString());
  });
}

