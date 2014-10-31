var passport = require('passport');

var JawboneController = function(){
  this.authorize = passport.authenticate('jawbone', { scope: 'basic_read' });
  this.callback  = passport.authenticate('jawbone', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/home');
  };
};

module.exports = JawboneController;
