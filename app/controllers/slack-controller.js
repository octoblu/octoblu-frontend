var passport = require('passport');

var SlackController = function(){
  this.authorize = passport.authenticate('slack');
  this.callback  = passport.authenticate('slack', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = SlackController;
