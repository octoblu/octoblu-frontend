var passport = require('passport');

var ReadabilityController = function(){
  this.authorize = passport.authenticate('readability');
  this.callback  = passport.authenticate('readability', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = ReadabilityController;
