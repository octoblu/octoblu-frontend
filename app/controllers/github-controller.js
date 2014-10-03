var passport = require('passport');

var GithubController = function(){
  this.authorize = passport.authenticate('github', { scope: 'user,repo,repo_deployment,notifications,gist' });
  this.callback  = passport.authenticate('github', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/home');
  };
};

module.exports = GithubController;
