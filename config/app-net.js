var AppNetStrategy = require('passport-appdotnet').Strategy;
var User     = require('../app/models/user');
var Channel = require('../app/models/channel');
var mongojs = require('mongojs');

var CONFIG = Channel.syncFindById('5393128e59745965b10fc541').oauth[process.env.NODE_ENV];
console.log("Environment Is", process.env.NODE_ENV);

CONFIG.tokenURL = 'https://account.app.net/oauth/access_token';
CONFIG.authorizationURL = 'https://account.app.net/oauth/authenticate';
CONFIG.passReqToCallback = true;

var appNetStrategy = new AppNetStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = mongojs.ObjectId('5393128e59745965b10fc541');

  User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token: accessToken});
  User.update(req.user).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = appNetStrategy;
