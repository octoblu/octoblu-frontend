var passport = require('passport');

var PodioController = function(){
  this.authorize = passport.authenticate('podio');
  this.callback  = passport.authenticate('podio', { failureRedirect: '/design' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = PodioController;
