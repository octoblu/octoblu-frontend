var passport = require('passport');

var WordPressController = function(){
  this.authorize = passport.authenticate('wordpress');
  this.callback  = passport.authenticate('wordpress', { failureRedirect: '/design' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = WordPressController;
