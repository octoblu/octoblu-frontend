var passport = require('passport');

var SalesforceController = function(){
  this.authorize = passport.authenticate('forcedotcom', { scope : ['id','chatter_api', 'api', 'full', 'refresh_token', 'visualforce', 'web'] });
  this.callback  = passport.authenticate('forcedotcom', { failureRedirect: '/design' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = SalesforceController;
