var passport = require('passport');

var ZendeskController = function(){
  this.authorize = passport.authenticate('zendesk');
  this.callback  = passport.authenticate('zendesk', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = ZendeskController;
