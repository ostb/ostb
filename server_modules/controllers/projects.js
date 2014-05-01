var Promise = require('bluebird');
var shell = require('./../shell_commands');
var bodyParser = require('body-parser');

exports.create = function(req, res) {
  var db = req.db;
  var collection = db.get('projectcollection');

  var newRepo = Promise.promisify(shell.init);
  newRepo(req.body.username, req.body.repo)
  .then(function(commitHash) {
    console.log('created repo ', req.body.repo);

    var newProject = {
      repo: req.body.repo,
      username: req.body.username,
      commits: {}
    }
    newProject.commits[commitHash] = {
      commitMessage: 'Created new project ' + req.body.repo,
      date: new Date()
    }
    collection.insert(newProject);

    res.send(201);
  })
  .catch(function(err){
    res.send(400, err.toString());
  })
}

exports.delete = function(req, res) {
  var db = req.db;
  var collection = db.get('projectcollection');

  shell.deleteRepo(req.query.username, req.query.repo)
  .then(function() {
    console.log('deleted repo ', req.query.repo);

    collection.remove({username: req.query.username, repo: req.query.repo});

    res.send(204);
  })
  .catch(function(err){
    res.send(400, err.toString());
  });
}

exports.clone = function(req, res) {
  var db = req.db;
  var collection = db.get('projectcollection');

  console.log(req.body);

  var copy = Promise.promisify(shell.clone);
  copy(req.body.username, req.body.owner, req.body.repo)
  .then(function(commitHash) {
    console.log('cloned repo ' + req.body.repo + ' into ' + req.body.username);

    var newProject = {
      repo: req.body.repo,
      username: req.body.username,
      commits: {}
    }
    newProject.commits[commitHash] = {
      commitMessage: 'Cloned project ' + req.body.repo + ' from ' + req.body.owner,
      date: new Date()
    }
    collection.insert(newProject);

    res.send(201);
  })
  .catch(function(err) {
    res.send(400, err.toString());
  })
}

exports.commit = function(req, res) {
  var db = req.db;
  var collection = db.get('projectcollection');

  var cmt = Promise.promisify(shell.commit);
  cmt(req.body.username, req.body.repo, req.body.commitMessage, req.body.commitBody)
  .then(function(commitHash){

    // var commit = {
    //   commitMessage: req.body.commitMessage,
    //   date: new Date()
    // };
    // var projects = {};
    // projects['projects.' + req.body.repo + "." + commitHash] = commit;
    // collection.update({username: req.body.username}, {$set: projects});

    var commits = {}
    commits['commits.' + commitHash] = {
      commitMessage: req.body.commitMessage,
      date: new Date()
    }
    collection.update({username: req.body.username, repo: req.body.repo}, {$set: commits});

    res.send(201);
  })
  .catch(function(err){
    res.send(400, err.toString());
  })
}

exports.getVersions = function(req, res) {
  var db = req.db;
  var collection = db.get('projectcollection');
  
  collection.findOne({username: req.query.username}, function(err, data) {
    if(err) {
      res.send(404, err.toString());
    }else {
      console.log(data.projects[req.query.repo]);
      res.send(data.projects[req.query.repo]);
    }
  })
}

exports.getProjects = function(req, res) {
  var db = req.db;
  var collection = db.get('projectcollection');

  collection.find({username: req.query.username}, function(err, data) {
    if(err) {
      res.send(404, err.toString());
    }else {
      res.send(data);
    }
  });
} 

// exports.checkout = function(req, res) {
//   var db = req.db;
//   var collection = db.get('usercollection');

//   console.log(req.query);

//   collection.findOne({username: req.query.username}, function(err, data) {
//     if(err) {
//       res.send(404, err.toString());
//     }else {
//       res.send(data.projects);
//     }
//   });
// }


