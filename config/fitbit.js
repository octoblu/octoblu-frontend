var FitbitStrategy = require('passport-fitbit').Strategy;
var User     = require('../app/models/user');
var Channel = require('../app/models/channel');
var mongojs = require('mongojs');

var CONFIG = Channel.syncFindById('52f97cc5a9909344830004ec').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var fitbitStrategy = new FitbitStrategy(CONFIG, function(req, accessToken, secret, profile, done){
  var channelId = mongojs.ObjectId('52f97cc5a9909344830004ec');

  User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token: accessToken, secret: secret});
  User.update(req.user).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = fitbitStrategy;
