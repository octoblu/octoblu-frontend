var passport = require('passport');

var ShareFileController = function(){
  this.authorize = passport.authenticate('sharefile', {});
  this.callback  = passport.authenticate('sharefile', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = ShareFileController;
