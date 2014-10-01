var passport = require('passport');

var SpotifyStrategy = function(){
  this.authorize = passport.authenticate('spotify');
  this.callback  = passport.authenticate('spotify', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = SpotifyStrategy;
