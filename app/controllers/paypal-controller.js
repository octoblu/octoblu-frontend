var passport = require('passport');

var PaypalController = function(){
  this.authorize = passport.authenticate('paypal', {});
  this.callback  = passport.authenticate('paypal', { failureRedirect: '/design' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = PaypalController;
