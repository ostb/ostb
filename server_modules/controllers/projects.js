var Promise = require('bluebird');
var shell = require('./../shell_commands');
var bodyParser = require('body-parser');
var fs = require('fs');

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
  });
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
      res.send(data.commits);
    }
  })
}

exports.getProjects = function(req, res) {
  var db = req.db;
  var collection = db.get('projectcollection');

  var queryObj = {};

  if(req.query.username){
    queryObj.username = req.query.username;
  }else if(req.query.id){
    queryObj._id = req.query.id;
  }
  if(req.query.repo) {
    queryObj.repo = req.query.repo;
  }

  collection.find(queryObj, function(err, data) {
    if(err) {
      res.send(404, err.toString());
    }else {
      res.send(data);
    }
  });
}

exports.getFile = function(req, res) {
  var checkout = Promise.promisify(shell.checkout);

  if(req.query.commitHash) {
    checkout(req.query.username, req.query.repo, req.query.commitHash)
    .then(function(data) {
      res.send(200, data);
    })
    .catch(function(err){
      res.send(400, err.toString());
    })
  }else {
    checkout(req.query.username, req.query.repo, null)
    .then(function(data) {
      res.send(200, data);
    })
    .catch(function(err){
      res.send(400, err.toString());
    });
  }
}

exports.getFolder = function(req, res) {
  var folder = {};
  var filepath = 'user_data/' + req.query.username + '/' + req.query.repo + '/';
  var read = Promise.promisify(fs.readFile);
  read(filepath + 'content.md', 'utf-8')
  .then(function(data) {
    folder['content.md'] = data;
    res.send(folder);
  })
  .catch(function(err){
    res.send(400, err.toString());
  });
}






