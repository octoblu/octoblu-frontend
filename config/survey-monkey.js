var SurveyMonkeyStrategy = require('passport-surveymonkey').Strategy;
var User = require('../app/models/user');
var Channel = require('../app/models/channel');
var mongojs = require('mongojs');

var CONFIG = Channel.syncFindByType('channel:survey-monkey').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var surveyMonkeyStrategy = new SurveyMonkeyStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = mongojs.ObjectId('53e259588e3257fb7d6fdad3');

  User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token: accessToken});
  User.update(req.user).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = surveyMonkeyStrategy;
