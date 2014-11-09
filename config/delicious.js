var DeliciousStrategy = require('passport-yahoo-oauth').Strategy;
var User              = require('../app/models/user');
var Channel           = require('../app/models/channel');
var mongojs = require('mongojs');

var channel = Channel.syncFindByType('channel:delicious');
var CONFIG = channel.oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var deliciousStrategy = new DeliciousStrategy(CONFIG, function(req, accessToken, secret, profile, done){
  var channelId = mongojs.ObjectId(channel._id);

  User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token: accessToken, secret: secret});
  User.update(user).then(function () {
    done(null, user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = deliciousStrategy;
