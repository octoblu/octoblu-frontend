var InstagramStrategy = require('passport-instagram').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Channel = require('../app/models/channel');

var CONFIG = Channel.syncFindById('541b21fe025549193cb82939').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var instagramStrategy = new InstagramStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = new mongoose.Types.ObjectId('541b21fe025549193cb82939');

  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: accessToken});
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = instagramStrategy;
