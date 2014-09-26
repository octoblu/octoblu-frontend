var passport = require('passport');

var FourSquareController = function(){
  this.authorize = passport.authenticate('foursquare');
  this.callback  = passport.authenticate('foursquare', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = FourSquareController;
