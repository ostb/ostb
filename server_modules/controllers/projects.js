var Promise = require('bluebird');
var shell = require('./../shell_commands');
var bodyParser = require('body-parser');

exports.create = function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');

  var newRepo = Promise.promisify(shell.init);
  newRepo(req.body.username, req.body.repo)
  .then(function(commitHash) {
    console.log('created repo ', req.body.repo);

    var commits = {};
    commits[commitHash] = {
      commitMessage: 'Created new project ' + req.body.repo,
      date: new Date()
    }
    var projects = {};
    projects['projects.' + req.body.repo] = commits;
    collection.update({username: req.body.username}, {$set: projects});

    res.send(201);
  })
  .catch(function(err){
    res.send(400, err.toString());
  })
}

exports.delete = function(req, res) {
  shell.deleteRepo(req.query.username, req.query.repo)
  .then(function() {
    console.log('deleted repo ', req.query.repo);
    res.send(204);
  })
  .catch(function(err){
    res.send(400, err.toString());
  });
}

exports.clone = function(req, res) {
  shell.clone(req.query.username, req.query.owner, req.query.repo)
  .then(function() {
    console.log('cloned repo ' + req.query.repo + ' into ' + req.query.username);
    res.send(201);
  })
  .catch(function(err) {
    res.send(400, err.toString());
  })
}



