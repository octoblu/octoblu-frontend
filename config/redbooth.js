var RedboothStrategy = require('passport-redbooth').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Channel = require('../app/models/channel');

var CONFIG = Channel.syncFindById('53f2431f710850ee08e28474').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var redboothStrategy = new RedboothStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = new mongoose.Types.ObjectId('53f2431f710850ee08e28474');

  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: accessToken});
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = redboothStrategy;
