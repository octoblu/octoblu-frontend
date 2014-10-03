var passport = require('passport');

var LinkedinController = function(){
  this.authorize = passport.authenticate('linkedin', {
  	'state': 'mAn5GimAn5Gig5coijg5coij',
  	'scope': ['r_emailaddress', 'r_basicprofile', 'r_network', 'r_contactinfo', 'rw_groups', 'w_messages', 'rw_company_admin', 'rw_nus', 'r_fullprofile']
	});
  this.callback  = passport.authenticate('linkedin', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = LinkedinController;
