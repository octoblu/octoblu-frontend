var InstagramStrategy = require('passport-instagram').Strategy;
var User     = require('../app/models/user');
var Channel = require('../app/models/channel');
var mongojs = require('mongojs');

var CONFIG = Channel.syncFindById('541b21fe025549193cb82939').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var instagramStrategy = new InstagramStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = mongojs.ObjectId('541b21fe025549193cb82939');

  User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token: accessToken});
  User.update(req.user).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = instagramStrategy;
