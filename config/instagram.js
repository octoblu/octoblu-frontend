'use strict';
var InstagramStrategy = require('passport-instagram').Strategy;
var User              = require('../app/models/user');
var Channel           = require('../app/models/channel');

var CONFIG = Channel.syncFindByType('channel:instagram').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var instagramStrategy = new InstagramStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:instagram', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = instagramStrategy;
