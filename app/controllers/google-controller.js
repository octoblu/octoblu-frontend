var passport = require('passport');

var GoogleController = function(){
  this.authorize = passport.authenticate('google', { scope: ['profile', 'email'] });
  this.callback  = passport.authenticate('google', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = GoogleController;
