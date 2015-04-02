var passport = require('passport');

var ThingiverseController = function(){
  this.authorize = passport.authenticate('thingiverse');
  this.callback  = passport.authenticate('thingiverse', { failureRedirect: '/design' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = ThingiverseController;
