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
  var db = req.db;
  var collection = db.get('usercollection');

  shell.deleteRepo(req.query.username, req.query.repo)
  .then(function() {
    console.log('deleted repo ', req.query.repo);

    var projects = {};
    projects['projects.' + req.query.repo] = '';
    collection.update({username: req.query.username}, {$unset: projects});

    res.send(204);
  })
  .catch(function(err){
    res.send(400, err.toString());
  });
}

exports.clone = function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');

  console.log(req.body);

  shell.clone(req.body.username, req.body.owner, req.body.repo)
  .then(function() {
    console.log('cloned repo ' + req.body.repo + ' into ' + req.body.username);

    // var commits = {};
    // commits[commitHash] = {
    //   commitMessage: 'Copied project ' + req.body.repo + 'from' + req.body.owner,
    //   date: new Date()
    // }
    // var projects = {};
    // projects['projects.' + req.body.repo] = commits;
    // collection.update({username: req.body.username}, {$set: projects});

    res.send(201);
  })
  .catch(function(err) {
    res.send(400, err.toString());
  })
}

exports.commit = function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');

  var cmt = Promise.promisify(shell.commit);
  cmt(req.body.username, req.body.repo, req.body.commitMessage, req.body.commitBody)
  .then(function(commitHash){

    var commit = {
      commitMessage: req.body.commitMessage,
      date: new Date()
    };
    var projects = {};
    projects['projects.' + req.body.repo + "." + commitHash] = commit;
    collection.update({username: req.body.username}, {$set: projects});

    res.send(201);
  })
  .catch(function(err){
    res.send(400, err.toString());
  })
}



