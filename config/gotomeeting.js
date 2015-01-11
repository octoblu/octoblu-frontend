'use strict';
var CitrixStrategy = require('passport-citrix').Strategy;
var User = require('../app/models/user');
var Channel = require('../app/models/channel');
var when = require('when');

var CONFIG = Channel.syncFindOauthConfigByType('channel:gotomeeting');

CONFIG.passReqToCallback = true;

var citrixStrategy = new CitrixStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done) {

when.all([
  User.addApiAuthorization(req.user, 'channel:gotomeeting', {
    authtype: 'oauth',
    token: accessToken
  }),
  User.addApiAuthorization(req.user, 'channel:GoToAssist', {
    authtype: 'oauth',
    token: accessToken
  }),
  User.addApiAuthorization(req.user, 'channel:GoToTraining', {
    authtype: 'oauth',
    token: accessToken
  }),
  User.addApiAuthorization(req.user, 'channel:GoToWebinar', {
    authtype: 'oauth',
    token: accessToken
  })
]).then(function() {

  done(null, req.user);
}).catch(function(error) {
  done(error);
})
});

module.exports = citrixStrategy;