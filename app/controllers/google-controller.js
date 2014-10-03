var passport = require('passport');

var GoogleController = function(){
  this.authorize = passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive'] });
  this.callback  = passport.authenticate('google', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/home');
  };
};

module.exports = GoogleController;
