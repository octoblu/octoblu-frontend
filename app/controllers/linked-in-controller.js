var passport = require('passport');

var LinkedinController = function(){
  this.authorize = passport.authenticate('linkedin');
  this.callback  = passport.authenticate('linkedin', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/home');
  };
};

module.exports = LinkedinController;
