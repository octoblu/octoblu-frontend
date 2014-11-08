var XeroStrategy = require('passport-xero').Strategy;
var User     = require('../app/models/user');
var Channel = require('../app/models/channel');
var mongojs = require('mongojs');

var CONFIG = Channel.syncFindByType('channel:xero').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var xeroStrategy = new XeroStrategy(CONFIG, function(req, accessToken, secret, profile, done){
  var channelId = mongojs.ObjectId('53e3fab413c57e0267403a89');

  User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth',  token: accessToken, secret: secret});
  User.update(req.user).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = xeroStrategy;
