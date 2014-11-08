var BitlyStrategy = require('passport-podio').Strategy;
var User     = require('../app/models/user');
var Channel = require('../app/models/channel');
var mongojs = require('mongojs');

var CONFIG = Channel.syncFindById('54458c5b5a370c58ca66a147').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var podioStrategy = new BitlyStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = mongojs.ObjectId('54458c5b5a370c58ca66a147');

  User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token: accessToken});
  User.update(req.user).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = podioStrategy;
