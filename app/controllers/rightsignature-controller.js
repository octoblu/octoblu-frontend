var passport = require('passport');

var RightSignatureController = function(){
  this.authorize = passport.authenticate('rightsignature');
  this.callback  = passport.authenticate('rightsignature', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = RightSignatureController;
