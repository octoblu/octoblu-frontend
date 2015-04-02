var passport = require('passport');

var ReadabilityController = function(){
  this.authorize = passport.authenticate('readability');
  this.callback  = passport.authenticate('readability', { failureRedirect: '/design' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = ReadabilityController;
