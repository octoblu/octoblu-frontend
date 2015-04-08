'use strict';
var PodioStrategy = require('passport-podio').Strategy;
var User          = require('../app/models/user');
var Channel       = require('../app/models/channel');

var CONFIG = Channel.syncFindOauthConfigByType('channel:podio');

CONFIG.passReqToCallback = true;

var podioStrategy = new PodioStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var expiresIn = Date.now() + profile._json.push.expires_in;

  User.addApiAuthorization(req.user, 'channel:podio', {authtype: 'oauth', token: accessToken, refreshToken: refreshToken, expiresIn: expiresIn}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = podioStrategy;
