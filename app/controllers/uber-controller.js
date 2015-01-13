var passport = require('passport');

var UberController = function(){
  this.authorize = passport.authenticate('uber');
  this.callback  = passport.authenticate('uber', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = UberController;
