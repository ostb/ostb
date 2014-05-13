var Promise = require('bluebird');
var shell = require('./../shell_commands');
var bodyParser = require('body-parser');
var fs = require('fs');
var authhelper = require('./authhelper');

exports.create = function(req, res) {
  
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
        members: [req.body.username],
        lastUpdate: new Date()
      }
      newProject.commits[commitHash] = {
        commitMessage: 'Created new project ' + req.body.repo,
        author: req.body.username,
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

    var copy = Promise.promisify(shell.clone);
    copy(req.body.username, req.body.owner, req.body.repo)
    .then(function(commitHash) {

      var newProject = {
        repo: req.body.repo,
        username: req.body.username,
        commits: {}
      }
      newProject.commits[commitHash] = {
        commitMessage: 'Cloned project ' + req.body.repo + ' from ' + req.body.owner,
        author: req.body.username,
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

  var auth = false;

  collection.findOne({username: req.body.username, repo: req.body.repo}, function(err, data) {
    if(err) {
      res.send(404, err.toString());
    }else {
      var members = data.members;
      if(req.session.user && members.indexOf(req.session.user.username) !== -1) {
        cmt(req.body.username, req.body.repo, req.body.commitMessage, req.body.commitBody, 'master')
        .then(function(commitHash){

          var commits = {}
          commits['commits.' + commitHash] = {
            commitMessage: req.body.commitMessage,
            author: req.body.author,
            date: new Date()
          }
          collection.update({username: req.body.username, repo: req.body.repo}, {$set: commits});
          collection.update({username: req.body.username, repo: req.body.repo}, {$set: {lastUpdate: new Date()}})

          res.send(201);
        })
        .catch(function(err){
          res.send(400, err.toString());
        })
      }else {
        cmt(req.body.username, req.body.repo, req.body.commitMessage, req.body.commitBody, 'contributions')
        .then(function(commitHash){

          var contributions = {}
          contributions['contributions.' + commitHash] = {
            commitMessage: req.body.commitMessage,
            author: req.body.author,
            date: new Date()
          }
          collection.update({username: req.body.username, repo: req.body.repo}, {$set: contributions});
          collection.update({username: req.body.username, repo: req.body.repo}, {$set: {lastUpdate: new Date()}})

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
  })
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

  var respond = function(err, data) {
    if(err) {
      res.send(404, err.toString());
    }else {
      res.send(data);
    }
  }

  var queryObj = {};

  if(req.query.username){
    queryObj.username = req.query.username;
  }else if(req.query.id){
    queryObj._id = req.query.id;
  }
  if(req.query.repo) {
    queryObj.repo = req.query.repo;
  }

  if(Object.keys(queryObj).length === 0) {
    collection.find(queryObj, {sort: {lastUpdate: -1}, limit: 15}, respond);
  }else {
    collection.find(queryObj, respond);
  }
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
  
  collection.findOne({username: req.query.username, repo: req.query.repo}, function(err, data) {
    if(err) {
      res.send(404, err.toString());
    }else {
      res.send(data.members);
    }
  })
}

exports.addMember = function(req, res) {
  if(authhelper.authenticate(req)){
    var db = req.db;
    var collection = db.get('projectcollection');

    collection.update({username: req.body.username, repo: req.body.repo}, {$push: {members: req.body.member}});
    res.send(201);

  }else{
    authhelper.authRedirect(req, res);
  }
}

exports.deleteMember = function(req, res) {
  if(authhelper.authenticate(req)){
    var db = req.db;
    var collection = db.get('projectcollection');

    collection.update({username: req.query.username, repo: req.query.repo}, {$pull: {members: req.query.member}});
    res.send(204);

  }else{
    authhelper.authRedirect(req, res);
  }
}


