var Promise = require('bluebird');
var shell = require('./../shell_commands');
var bodyParser = require('body-parser');

exports.create = function(req, res) {
  var newRepo = Promise.promisify(shell.init);
  newRepo(req.body.username, req.body.repo)
  .then(function() {
    console.log('created repo ', req.body.repo);
    res.send(201);
  })
  .catch(function(err){
    res.send(400, err.toString());
  })
}
