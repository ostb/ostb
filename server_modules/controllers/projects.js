var Promise = require('bluebird');
var shell = require('./../shell_commands');
var bodyParser = require('body-parser');

exports.create = function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');

  var newRepo = Promise.promisify(shell.init);
  newRepo(req.body.username, req.body.repo)
  .then(function() {
    console.log('created repo ', req.body.repo);

    // var find = Promise.promisify(collection.findOne);
    // find({username: req.body.username})
    // .then(function(result) {
    //   var projects = result.projects;
    //   projects[req.body.repo] = {};
      collection.update({username: req.body.username}, {$set: {'projects.foo': 'foo'}});
      
      var project = {};
      project[req.body.repo] = {};
      collection.update({username: req.body.username}, {$set: {projects: project}});

    // })
    // .catch(function(err) {
    //   res.send(400, err.toString())
    // })

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



