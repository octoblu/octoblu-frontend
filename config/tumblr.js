var TumblrStrategy = require('passport-tumblr').Strategy;
var User     = require('../app/models/user');
var Channel = require('../app/models/channel');
var mongojs = require('mongojs');

var CONFIG = Channel.syncFindById('52f97e4366f76866b600051d').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var tumblrStrategy = new TumblrStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = mongojs.ObjectId('52f97e4366f76866b600051d');

  User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token: accessToken});
  User.update(req.user).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = tumblrStrategy;
