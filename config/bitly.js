'use strict';
var BitlyStrategy = require('passport-bitly').Strategy;
var User          = require('../app/models/user');
var Channel       = require('../app/models/channel');

var CONFIG = Channel.syncFindByType('channel:bitly').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var bitlyStrategy = new BitlyStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:bitly', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = bitlyStrategy;
