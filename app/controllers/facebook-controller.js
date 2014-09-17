var passport = require('passport');

var FacebookController = function(){
  this.authorize = passport.authenticate('facebook', { scope: ['email'] });
  this.callback  = passport.authenticate('facebook', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = FacebookController;
