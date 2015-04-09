'use strict';
var UberStrategy = require('passport-uber').Strategy;
var User              = require('../../app/models/user');
var Channel           = require('../../app/models/channel');

var CONFIG = Channel.syncFindOauthConfigByType('channel:uber');

CONFIG.passReqToCallback = true;

var uberStrategy = new UberStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:uber', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = uberStrategy;
