'use strict';
var RightSignatureStrategy = require('passport-rightsignature').Strategy;
var User = require('../app/models/user');
var Channel = require('../app/models/channel');

var CONFIG = Channel.syncFindOauthConfigByType('channel:rightSignature');

CONFIG.passReqToCallback = true;

var rightsignatureStrategy = new RightSignatureStrategy(CONFIG, function(req, token, tokenSecret, profile, done) {

  User.addApiAuthorization(req.user, 'channel:rightSignature', {
    authtype: 'oauth',
    token: token
  }).then(function() {
    done(null, req.user);
  }).catch(function(error) {
    done(error);
  });
});

module.exports = rightsignatureStrategy;