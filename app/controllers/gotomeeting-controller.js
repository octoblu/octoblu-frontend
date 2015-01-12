var passport = require('passport');

var GoToMeetingController = function(){
  this.authorize = passport.authenticate('gotomeeting', {});
  this.callback  = passport.authenticate('gotomeeting', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = GoToMeetingController;
