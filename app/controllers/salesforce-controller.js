var passport = require('passport');

var SalesforceController = function(){
  this.authorize = passport.authenticate('forcedotcom', {});
  this.callback  = passport.authenticate('forcedotcom', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = SalesforceController;
