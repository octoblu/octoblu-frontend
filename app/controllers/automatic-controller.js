var passport = require('passport');

var AutomaticController = function(){
  this.authorize = passport.authenticate('automatic');
  this.callback  = passport.authenticate('automatic', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = AutomaticController;
