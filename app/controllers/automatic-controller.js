var passport = require('passport');

var AutomaticController = function(){
  this.authorize = passport.authenticate('automatic', { scope: ["scope:location scope:vehicle:profile scope:trip scope:vehicle:events scope:public scope:user:profile scope:behavior"]});
  this.callback  = passport.authenticate('automatic', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = AutomaticController;
