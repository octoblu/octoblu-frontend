var FitbitStrategy = require('passport-fitbit').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Channel = require('../app/models/channel');

var CONFIG = Channel.syncFindById('52f97cc5a9909344830004ec').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var fitbitStrategy = new FitbitStrategy(CONFIG, function(req, accessToken, secret, profile, done){
  var channelId = new mongoose.Types.ObjectId('52f97cc5a9909344830004ec');

  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: accessToken, secret: secret});
  console.log(req.user);
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = fitbitStrategy;
