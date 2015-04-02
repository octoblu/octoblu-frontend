var passport = require('passport');

var GoToWebinarController = function(){
  this.authorize = passport.authenticate('gotowebinar', {});
  this.callback  = passport.authenticate('gotowebinar', { failureRedirect: '/design' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = GoToWebinarController;
