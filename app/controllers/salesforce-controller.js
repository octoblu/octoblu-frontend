var passport = require('passport');

var SalesforceController = function(){
<<<<<<< HEAD
  this.authorize = passport.authenticate('forcedotcom', {});
=======
  this.authorize = passport.authenticate('forcedotcom', { scope : ['id','chatter_api', 'api', 'full', 'refresh_token', 'visualforce', 'web'] });
>>>>>>> FETCH_HEAD
  this.callback  = passport.authenticate('forcedotcom', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = SalesforceController;
