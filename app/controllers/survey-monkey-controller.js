var passport = require('passport');

var SurveyMonkeyController = function(){
  this.authorize = passport.authenticate('surveymonkey');
  this.callback  = passport.authenticate('surveymonkey', { failureRedirect: '/design' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = SurveyMonkeyController;
