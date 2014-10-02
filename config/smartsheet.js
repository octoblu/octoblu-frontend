var util = require('util');
var SmartsheetStrategy = require('passport-smartsheet').Strategy;
var crypto = require('crypto');
var options = {};

var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Channel = require('../app/models/channel');

var CONFIG = Channel.syncFindById('533987f06d8a28a6ca8ff923').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var smartsheetStrategy = new SmartsheetStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = new mongoose.Types.ObjectId('533987f06d8a28a6ca8ff923');

  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: accessToken});
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = smartsheetStrategy;
