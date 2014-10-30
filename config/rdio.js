var RdioStrategy = require('passport-rdio').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Channel = require('../app/models/channel');

var CONFIG = Channel.syncFindById('53d15c363e304fe01a0851ee').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var rdioStrategy = new RdioStrategy(CONFIG, function(req, accessToken, secret, profile, done){
  var channelId = new mongoose.Types.ObjectId('53d15c363e304fe01a0851ee');
  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: accessToken, secret: secret});
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = rdioStrategy;
