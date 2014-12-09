'use strict';
var JawboneStrategy = require('passport-jawbone').Strategy;
var User            = require('../app/models/user');
var Channel         = require('../app/models/channel');

var CONFIG = Channel.syncFindOauthConfigByType('channel:jawbone');

CONFIG.passReqToCallback = true;

var jawboneStrategy = new JawboneStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:jawbone', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = jawboneStrategy;
