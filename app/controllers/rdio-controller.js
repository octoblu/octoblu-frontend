var passport = require('passport');

var RdioController = function(){
  this.authorize = passport.authenticate('rdio', { scope: 'user' });
  this.callback  = passport.authenticate('rdio', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = RdioController;
