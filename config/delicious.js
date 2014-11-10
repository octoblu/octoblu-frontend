'use strict';
var DeliciousStrategy = require('passport-yahoo-oauth').Strategy;
var User              = require('../app/models/user');
var Channel           = require('../app/models/channel');

var CONFIG = Channel.syncFindByType('channel:delicious').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var deliciousStrategy = new DeliciousStrategy(CONFIG, function(req, accessToken, secret, profile, done){

  User.addApiAuthorization(req.user, 'channel:delicious', {authtype: 'oauth', token: accessToken, secret: secret}).then(function () {
    done(null, user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = deliciousStrategy;
