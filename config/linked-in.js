var LinkedinController = require('passport-linkedin').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Channel = require('../app/models/channel');

var CONFIG = Channel.syncFindById('52f97c5ba990930c8c0003ca').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var linkedinStrategy = new LinkedinController(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = new mongoose.Types.ObjectId('52f97c5ba990930c8c0003ca');

  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: accessToken});
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = linkedinStrategy;
