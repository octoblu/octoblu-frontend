'use strict';
var SurveyMonkeyStrategy = require('passport-surveymonkey').Strategy;
var User                 = require('../app/models/user');
var Channel              = require('../app/models/channel');

var CONFIG = Channel.syncFindOauthConfigByType('channel:survey-monkey');

CONFIG.passReqToCallback = true;

var surveyMonkeyStrategy = new SurveyMonkeyStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:survey-monkey', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = surveyMonkeyStrategy;
