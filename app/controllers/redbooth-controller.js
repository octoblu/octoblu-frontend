var passport = require('passport');

var RedBoothController = function(){
  this.authorize = passport.authenticate('redbooth');
  this.callback  = passport.authenticate('redbooth', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = RedBoothController;
