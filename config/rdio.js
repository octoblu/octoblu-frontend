var RdioStrategy = require('passport-rdio').Strategy;
var User     = require('../app/models/user');
var Channel = require('../app/models/channel');
var mongojs = require('mongojs');

var CONFIG = Channel.syncFindById('53d15c363e304fe01a0851ee').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var rdioStrategy = new RdioStrategy(CONFIG, function(req, accessToken, secret, profile, done){
  var channelId = mongojs.ObjectId('53d15c363e304fe01a0851ee');
  User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token: accessToken, secret: secret});
  User.update(req.user).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = rdioStrategy;
