var UserVoiceStrategy = require('passport-uservoice').Strategy;
var User     = require('../app/models/user');
var Channel = require('../app/models/channel');
var mongojs = require('mongojs');

var CONFIG = Channel.syncFindByType('channel:uservoice').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var uservoiceStrategy = new UserVoiceStrategy(CONFIG, function(req, token, secret, profile, done){
  var channelId = mongojs.ObjectId('53f616b5710850ee08e28482');
  User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth',  token: token, secret: secret});
  User.update(req.user).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = uservoiceStrategy;
