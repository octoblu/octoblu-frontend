var UserVoiceStrategy = require('passport-uservoice').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Channel = require('../app/models/channel');

var CONFIG = Channel.syncFindByType('channel:uservoice').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var uservoiceStrategy = new UserVoiceStrategy(CONFIG, function(req, token, secret, profile, done){
  var channelId = '53f616b5710850ee08e28482';
  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth',  token: token, secret: secret});
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = uservoiceStrategy;
