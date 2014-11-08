var NestStrategy = require('passport-nest').Strategy;
var User     = require('../app/models/user');
var Channel = require('../app/models/channel');
var mongojs = require('mongojs');

var CONFIG = Channel.syncFindById('53c403b467605b33c1d4b09b').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var nestStrategy = new NestStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = mongojs.ObjectId('53c403b467605b33c1d4b09b');

  User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token: accessToken});
  User.update(req.user).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = nestStrategy;
