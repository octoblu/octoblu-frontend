var BitlyStrategy = require('passport-bitly').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Channel = require('../app/models/channel');

var CONFIG = Channel.syncFindById('52f9b79febbb40641600000b').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var bitlyStrategy = new BitlyStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = new mongoose.Types.ObjectId('52f9b79febbb40641600000b');

  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: accessToken});
  console.log(req.user);
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = bitlyStrategy;
