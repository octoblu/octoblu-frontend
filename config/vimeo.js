var VimeoStrategy = require('passport-vimeo').Strategy;
var User     = require('../app/models/user'); 
var Channel = require('../app/models/channel');
var mongojs = require('mongojs');

var CONFIG = Channel.syncFindById('52f97d3c0db568444400040e').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var vimeoStrategy = new VimeoStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = mongojs.ObjectId('52f97d3c0db568444400040e');

  User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token: accessToken});
  User.update(req.user).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = vimeoStrategy;
