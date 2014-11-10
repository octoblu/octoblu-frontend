'use strict';
var PodioStrategy = require('passport-podio').Strategy;
var User          = require('../app/models/user');
var Channel       = require('../app/models/channel');

var CONFIG = Channel.syncFindByType('channel:podio').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var podioStrategy = new PodioStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:podio', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = podioStrategy;
