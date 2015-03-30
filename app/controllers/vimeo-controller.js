var passport = require('passport');

var VimeoController = function(){
  this.authorize = passport.authenticate('vimeo');
  this.callback  = passport.authenticate('vimeo', { failureRedirect: '/design' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = VimeoController;
