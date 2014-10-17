var SalesForceStrategy = require('passport-forcedotcom').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');
<<<<<<< HEAD

var CONFIG = {
  development: {
    clientID:     'INSERT_SECERT_HERE',
    clientSecret: 'INSERT_SECERT_HERE',
    callbackURL:    'http://localhost:8080/api/oauth/salesforce/callback'
  },
  production: {
    clientID:     'INSERT_SECERT_HERE',
    clientSecret: 'INSERT_SECERT_HERE',
    callbackURL:    'https://app.octoblu.com/api/oauth/salesforce/callback'
  },
  staging: {
    clientID:     'INSERT_SECERT_HERE',
    clientSecret: 'INSERT_SECERT_HERE',
    callbackURL:    'https://staging.octoblu.com/api/oauth/salesforce/callback'
  }
}[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;
CONFIG.tokenMethod = 'access_token_bearer';
=======
var Channel = require('../app/models/channel');

var channel = Channel.syncFindByType('channel:salesforce');
var CONFIG = channel.oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;
>>>>>>> FETCH_HEAD
CONFIG.scope = ['id','chatter_api', 'api', 'full', 'refresh_token', 'visualforce', 'web'];

var salesForceStrategy = new SalesForceStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = new mongoose.Types.ObjectId('542ed0142df9c20401f53dcc');

<<<<<<< HEAD
  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: accessToken});
=======
	var auth = {authtype: 'oauth', token: accessToken};
  req.user.overwriteOrAddApiByChannelId(channelId, auth);
>>>>>>> FETCH_HEAD
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = salesForceStrategy;
