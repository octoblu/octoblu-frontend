var RedboothStrategy = require('passport-redbooth').Strategy;
var User     = require('../app/models/user');
var Channel = require('../app/models/channel');
var mongojs = require('mongojs');

var CONFIG = Channel.syncFindById('53f2431f710850ee08e28474').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var redboothStrategy = new RedboothStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = mongojs.ObjectId('53f2431f710850ee08e28474');

  User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token: accessToken});
  User.update(req.user).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = redboothStrategy;
