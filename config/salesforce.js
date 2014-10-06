var SalesForceStrategy = require('passport-forcedotcom').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Channel = require('../app/models/channel');

var channel = Channel.syncFindByType('channel:salesforce');
var CONFIG = channel.oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;
CONFIG.scope = ['id','chatter_api', 'api', 'full', 'refresh_token', 'visualforce', 'web'];

var salesForceStrategy = new SalesForceStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = new mongoose.Types.ObjectId('542ed0142df9c20401f53dcc');

  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: accessToken});
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = salesForceStrategy;
