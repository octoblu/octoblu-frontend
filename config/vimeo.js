var VimeoStrategy = require('passport-vimeo').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Channel = require('../app/models/channel');

var CONFIG = Channel.syncFindById('52f97d3c0db568444400040e').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var vimeoStrategy = new VimeoStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = new mongoose.Types.ObjectId('52f97d3c0db568444400040e');

  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: accessToken});
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = vimeoStrategy;
