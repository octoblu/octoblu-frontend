var passport = require('passport');

var DeliciousController = function(){
  this.authorize = passport.authenticate('yahoo', {});
  this.callback  = passport.authenticate('yahoo', { failureRedirect: '/design' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = DeliciousController;
