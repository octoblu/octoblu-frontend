'use strict';
var GoToAssistStrategy = require('passport-citrix').Strategy;
var User            = require('../../app/models/user');
var Channel         = require('../../app/models/channel');

var CONFIG = Channel.syncFindOauthConfigByType('channel:gotoassist');

CONFIG.passReqToCallback = true;
CONFIG.name = 'gotoassist';

var goToAssistStrategy = new GoToAssistStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:gotoassist', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = goToAssistStrategy;
