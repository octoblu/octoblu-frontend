'use strict';
var UserVoiceStrategy = require('passport-uservoice').Strategy;
var User              = require('../app/models/user');
var Channel           = require('../app/models/channel');

var CONFIG = Channel.syncFindOauthConfigByType('channel:uservoice');

CONFIG.passReqToCallback = true;

var uservoiceStrategy = new UserVoiceStrategy(CONFIG, function(req, token, secret, profile, done){

  User.addApiAuthorization(req.user, 'channel:uservoice', {authtype: 'oauth',  token: token, secret: secret}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = uservoiceStrategy;
