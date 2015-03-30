var passport = require('passport');

var FitbitController = function(){
  this.authorize = passport.authenticate('fitbit', { scope: ['r_basicprofile', 'r_emailaddress'] });
  this.callback  = passport.authenticate('fitbit', { failureRedirect: '/design' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = FitbitController;
