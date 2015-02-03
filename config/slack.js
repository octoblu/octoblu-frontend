'use strict';
var SlackStrategy = require('passport-slack').Strategy;
var User              = require('../app/models/user');
var Channel           = require('../app/models/channel');

var CONFIG = Channel.syncFindOauthConfigByType('channel:slack');

CONFIG.passReqToCallback = true;

var slackStrategy = new SlackStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:slack', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = slackStrategy;
