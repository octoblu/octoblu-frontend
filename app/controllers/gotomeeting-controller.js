var passport = require('passport');

var GotoMeetingController = function(){
  this.authorize = passport.authenticate('citrix', {});
  this.callback  = passport.authenticate('citrix', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = GotoMeetingController;
