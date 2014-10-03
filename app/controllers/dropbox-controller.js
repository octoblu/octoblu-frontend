var passport = require('passport');

var DropboxController = function(){
  this.authorize = passport.authenticate('dropbox-oauth2');
  this.callback  = passport.authenticate('dropbox-oauth2', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};


module.exports = DropboxController;
