var Promise = require('bluebird');
var shell = require('./../shell_commands');
var bodyParser = require('body-parser');

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
  if(authhelper.authenticate(req)){
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
  }else{
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

  // if(req.session.user.username === req.query.username){

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
  // if(authhelper.authenticate(req)){

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
      })
    }
  // }else{
  //   authhelper.authRedirect(req, res);
  // }
}







