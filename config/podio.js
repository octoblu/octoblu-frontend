var BitlyStrategy = require('passport-podio').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Channel = require('../app/models/channel');

var CONFIG = Channel.syncFindById('54458c5b5a370c58ca66a147').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var podioStrategy = new BitlyStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = new mongoose.Types.ObjectId('54458c5b5a370c58ca66a147');

  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: accessToken});
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = podioStrategy;
