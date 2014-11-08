var CitrixStrategy = require('passport-citrix').Strategy;
var User     = require('../app/models/user');
var Channel = require('../app/models/channel');
var mongojs = require('mongojs');

var channel = Channel.syncFindByType('channel:gotomeeting');
var CONFIG = channel.oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var citrixStrategy = new CitrixStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = mongojs.ObjectId(channel._id);

  User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token: accessToken});
  User.update(req.user).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = citrixStrategy;
