'use strict';
var GoToMeetingStrategy = require('passport-citrix').Strategy;
var User            = require('../../app/models/user');
var Channel         = require('../../app/models/channel');

var CONFIG = Channel.syncFindOauthConfigByType('channel:gotomeeting');

CONFIG.passReqToCallback = true;
CONFIG.name = 'gotomeeting';

var goToMeetingStrategy = new GoToMeetingStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:gotomeeting', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = goToMeetingStrategy;
