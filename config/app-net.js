var AppNetStrategy = require('passport-appdotnet').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Channel = require('../app/models/channel');

var CONFIG = Channel.syncFindById('5393128e59745965b10fc541').oauth[process.env.NODE_ENV];
console.log("Environment Is", process.env.NODE_ENV);

CONFIG.tokenURL = 'https://account.app.net/oauth/access_token';
CONFIG.authorizationURL = 'https://account.app.net/oauth/authenticate';
CONFIG.passReqToCallback = true;

var appNetStrategy = new AppNetStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = new mongoose.Types.ObjectId('5393128e59745965b10fc541');

  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: accessToken});
  console.log(req.user);
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = appNetStrategy;
