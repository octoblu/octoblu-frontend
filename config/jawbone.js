var JawboneStrategy = require('passport-jawbone').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Channel = require('../app/models/channel');

var channel = Channel.syncFindByType('channel:jawbone');
var CONFIG = channel.oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var jawboneStrategy = new JawboneStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = new mongoose.Types.ObjectId(channel._id);

  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: accessToken});
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = jawboneStrategy;