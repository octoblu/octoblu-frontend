'use strict';
var OctobluStrategy = require('passport-octoblu').Strategy;
var User            = require('../../app/models/user');
var Channel         = require('../../app/models/channel');

var CONFIG = Channel.syncFindOauthConfigByType('channel:octoblu');

CONFIG.passReqToCallback = true;

var octobluStrategy = new OctobluStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:octoblu', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = octobluStrategy;
