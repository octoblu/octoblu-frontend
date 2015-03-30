var passport = require('passport');

var FourSquareController = function(){
  this.authorize = passport.authenticate('foursquare');
  this.callback  = passport.authenticate('foursquare', { failureRedirect: '/design' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = FourSquareController;
