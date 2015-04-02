var passport = require('passport');

var GoToTrainingController = function(){
  this.authorize = passport.authenticate('gototraining', {});
  this.callback  = passport.authenticate('gototraining', { failureRedirect: '/design' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = GoToTrainingController;
