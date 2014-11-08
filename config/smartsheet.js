var util = require('util');
var SmartsheetStrategy = require('passport-smartsheet').Strategy;
var crypto = require('crypto');
var options = {};

var User     = require('../app/models/user');
var Channel = require('../app/models/channel');
var mongojs = require('mongojs');

var CONFIG = Channel.syncFindById('533987f06d8a28a6ca8ff923').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var smartsheetStrategy = new SmartsheetStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = mongojs.ObjectId('533987f06d8a28a6ca8ff923');

  User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token: accessToken});
  User.update(req.user).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = smartsheetStrategy;
