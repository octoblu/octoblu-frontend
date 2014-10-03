var passport = require('passport');

var BitlyController = function(){
  this.authorize = passport.authenticate('bitly');
  this.callback  = passport.authenticate('bitly', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = BitlyController;
