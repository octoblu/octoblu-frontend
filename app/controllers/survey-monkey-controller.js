var passport = require('passport');

var SurveyMonkeyController = function(){
  this.authorize = passport.authenticate('surveymonkey');
  this.callback  = passport.authenticate('surveymonkey', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = SurveyMonkeyController;
