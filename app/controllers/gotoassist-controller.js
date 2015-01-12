var passport = require('passport');

var GoToAssistController = function(){
  this.authorize = passport.authenticate('gotoassist', {});
  this.callback  = passport.authenticate('gotoassist', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = GoToAssistController;
