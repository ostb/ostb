var bodyParser = require('body-parser');

exports.authenticate = function(req){
  console.log('req.session.user', req.session.user);
  console.log('req.session.user.username', req.session.user.username);
  console.log('req.body.username', req.body.username);
  console.log('req.query.username', req.query.username);
  console.log('TF', req.session.user.username === (req.body ? req.body.username : undefined || req.query.username));
  var comparator; 
  if (req.body && req.body.username){
    comparator = req.body.username;
  }
  if(req.query && req.query.username){
    comparator = req.query.username;
  }
  // return req.session.user.username === (req.body ? req.body.username : req.query.username);
  return comparator === req.session.user.username;
};

exports.authRedirect = function(req, res){
  res.send(401);
};
