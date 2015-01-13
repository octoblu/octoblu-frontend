'use strict';
var GoToWebinarStrategy = require('passport-citrix').Strategy;
var User            = require('../app/models/user');
var Channel         = require('../app/models/channel');

var CONFIG = Channel.syncFindOauthConfigByType('channel:gotowebinar');

CONFIG.passReqToCallback = true;
CONFIG.name = 'gotowebinar';

var goToWebinarStrategy = new GoToWebinarStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:gotowebinar', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = goToWebinarStrategy;
