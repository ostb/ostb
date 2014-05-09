var Promise = require('bluebird');
var shell = require('./../shell_commands');
var bodyParser = require('body-parser');
var fs = require('fs');
var authhelper = require('./authhelper');

exports.create = function(req, res) {
  console.log('req.body inside project js', req.body);
  
  if(authhelper.authenticate(req)){

    var db = req.db;
    var collection = db.get('projectcollection');

    var newRepo = Promise.promisify(shell.init);
    newRepo(req.body.username, req.body.repo)
    .then(function(commitHash) {

      var newProject = {
        repo: req.body.repo,
        username: req.body.username,
        commits: {},
        contributions: {},
        members: [req.body.username]
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
  }else{
    authhelper.authRedirect(req, res);
  }
}

exports.delete = function(req, res) {
  if(authhelper.authenticate(req)){
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
  }else{
    authhelper.authRedirect(req, res);
  }
}

exports.clone = function(req, res) {
  if(authhelper.authenticate(req)){
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
  }else{
    authhelper.authRedirect(req, res);
  }
}

exports.commit = function(req, res) {
  var db = req.db;
  var collection = db.get('projectcollection');
  var cmt = Promise.promisify(shell.commit);
  
  if(authhelper.authenticate(req)){         //authenticated, so commit as project

    cmt(req.body.username, req.body.repo, req.body.commitMessage, req.body.commitBody, 'master')
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
  }else{                                     //unathenticated, so commit as contribution
    cmt(req.body.username, req.body.repo, req.body.commitMessage, req.body.commitBody, 'contributions')
    .then(function(commitHash){

      var contributions = {}
      contributions['contributions.' + commitHash] = {
        commitMessage: req.body.commitMessage,
        date: new Date()
      }
      collection.update({username: req.body.username, repo: req.body.repo}, {$set: contributions});

      return shell.switchToMaster(req.body.username, req.body.repo);
    })
    .then(function() {
      res.send(201);
    })
    .catch(function(err){
      res.send(400, err.toString());
    })
  }
}

exports.removeContribution = function(req, res) {
  var db = req.db;
  var collection = db.get('projectcollection');
  
  if(authhelper.authenticate(req)){         //authenticated, so commit as project
    
    var contributions = {};
    contributions['contributions.' + req.query.commitHash] = {};
    collection.update({username: req.query.username, repo: req.query.repo}, {$unset: contributions});

    res.send(204);
  }else{                                     //unauthenticated, so commit as contribution
    authhelper.authRedirect(req, res);
  }
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

  checkout(req.query.username, req.query.repo, req.query.commitHash)
  .then(function(data) {
    res.send(200, data);
  })
  .catch(function(err){
    res.send(400, err.toString());
  })
}

exports.getFolder = function(req, res) {
  var folder = {};
  var filepath = 'user_data/' + req.query.username + '/' + req.query.repo + '/';
  var read = Promise.promisify(fs.readFile);
  read(filepath + 'content.md', 'utf-8')
  .then(function(data) {
    folder['content.md'] = data;
    return read('public/css/normalize.css', 'utf-8')
  })
  .then(function(data) {
    folder['normalize.css'] = data;
    return read('public/css/default.css', 'utf-8')
  })
  .then(function(data) {
    folder['default.css'] = data;
    res.send(folder);
  })
  .catch(function(err){
    res.send(400, err.toString());
  });
}

exports.getMembers = function(req, res) {
  var db = req.db;
  var collection = db.get('projectcollection');
  
  collection.findOne({username: req.query.username}, function(err, data) {
    if(err) {
      res.send(404, err.toString());
    }else {
      res.send(data.members);
    }
  })
}




