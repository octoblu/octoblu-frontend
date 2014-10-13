var TumblrStrategy = require('passport-tumblr').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Channel = require('../app/models/channel');

var CONFIG = Channel.syncFindById('52f97e4366f76866b600051d').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var tumblrStrategy = new TumblrStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = new mongoose.Types.ObjectId('52f97e4366f76866b600051d');

  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: accessToken});
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = tumblrStrategy;
