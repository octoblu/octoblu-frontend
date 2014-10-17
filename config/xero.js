var XeroStrategy = require('passport-xero').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Channel = require('../app/models/channel');

var CONFIG = Channel.syncFindByType('channel:xero').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var xeroStrategy = new XeroStrategy(CONFIG, function(req, accessToken, secret, profile, done){
  var channelId = new mongoose.Types.ObjectId('53e3fab413c57e0267403a89');

  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth',  token: accessToken, secret: secret});
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = xeroStrategy;
