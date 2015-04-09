'use strict';
var SmartsheetStrategy = require('passport-smartsheet').Strategy;
var User               = require('../../app/models/user');
var Channel            = require('../../app/models/channel');

var CONFIG = Channel.syncFindOauthConfigByType('channel:smartsheet');

CONFIG.passReqToCallback = true;

var smartsheetStrategy = new SmartsheetStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.overwriteOrAddApiByChannelId(req.user, 'channel:smartsheet', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = smartsheetStrategy;
