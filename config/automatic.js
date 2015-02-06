'use strict';
var AutomaticStrategy    = require('passport-automatic').Strategy;
var User                 = require('../app/models/user');
var Channel              = require('../app/models/channel');

var CONFIG = Channel.syncFindOauthConfigByType('channel:automatic');

CONFIG.passReqToCallback = true;

var automaticStrategy = new AutomaticStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:automatic', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = automaticStrategy;
