var NestStrategy = require('passport-nest').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Channel = require('../app/models/channel');

var CONFIG = Channel.syncFindById('53c403b467605b33c1d4b09b').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var nestStrategy = new NestStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = new mongoose.Types.ObjectId('53c403b467605b33c1d4b09b');

  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: accessToken});
  console.log(req.user);
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = nestStrategy;
