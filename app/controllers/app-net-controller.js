var passport = require('passport');

var AppNetController = function(){
  this.authorize = passport.authenticate('appdotnet', { scope: 'basic stream write_post follow public_messages' });
  this.callback  = passport.authenticate('appdotnet', { failureRedirect: '/design' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = AppNetController;
