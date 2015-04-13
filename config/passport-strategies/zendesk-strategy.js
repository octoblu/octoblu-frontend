'use strict';
var ZendeskStrategy = require('passport-zendesk').Strategy;
var User = require('../../app/models/user');
var Channel = require('../../app/models/channel');

var CONFIG = Channel.syncFindOauthConfigByType('channel:zendesk');
CONFIG.passReqToCallback = true;

var zendeskStrategy = new ZendeskStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done) {
  User.addApiAuthorization(req.user, 'channel:zendesk', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = zendeskStrategy;
