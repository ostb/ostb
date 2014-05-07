var bodyParser = require('body-parser');

exports.authenticate = function(req){
  var comparator; 
  if (req.body && req.body.username){
    comparator = req.body.username;
  }
  if(req.query && req.query.username){
    comparator = req.query.username;
  }
  return comparator === req.session.user.username;
};

exports.authRedirect = function(req, res){
  res.send(401);
};
