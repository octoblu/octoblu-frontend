var passport = require('passport');

var LinkedinController = function(){
  this.authorize = passport.authenticate('linkedin', {'state': 'mAn5GimAn5Gig5coijg5coij'});
  this.callback  = passport.authenticate('linkedin', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = LinkedinController;
