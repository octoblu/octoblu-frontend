var SalesForceStrategy = require('passport-forcedotcom').Strategy;
var User     = require('../app/models/user');
var Channel = require('../app/models/channel');
var mongojs = require('mongojs');

var channel = Channel.syncFindByType('channel:salesforce');
var CONFIG = channel.oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;
CONFIG.scope = ['id','chatter_api', 'api', 'full', 'refresh_token', 'visualforce', 'web'];

var salesForceStrategy = new SalesForceStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = mongojs.ObjectId('542ed0142df9c20401f53dcc');

	var auth = {authtype: 'oauth', token: accessToken};
  User.overwriteOrAddApiByChannelId(req.user, channelId, auth);
  User.update(req.user).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = salesForceStrategy;
