var passport = require('passport');

var InstagramController = function(){
  this.authorize = passport.authenticate('instagram');
  this.callback  = passport.authenticate('instagram', { failureRedirect: '/design' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = InstagramController;
