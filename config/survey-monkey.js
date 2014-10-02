var SurveyMonkeyStrategy = require('passport-surveymonkey').Strategy;
var mongoose = require('mongoose');
var Channel = require('../app/models/channel');

var CONFIG = Channel.syncFindByType('channel:survey-monkey').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var surveyMonkeyStrategy = new SurveyMonkeyStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = new mongoose.Types.ObjectId('53e259588e3257fb7d6fdad3');

  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: accessToken});
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = surveyMonkeyStrategy;
