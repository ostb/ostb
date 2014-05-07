var bodyParser = require('body-parser');

exports.authenticate = function(req){
  var comparator; 
  if (req.body && req.body.username){
    comparator = req.body.username;
  }
  if(req.query && req.query.username){
    comparator = req.query.username;
  }
  
  if(req.session.user) {
    return comparator === req.session.user.username;
  }
  return false;
};

exports.authRedirect = function(req, res){
  res.send(401);
};
