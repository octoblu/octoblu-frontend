'use strict';
var CitrixStrategy = require('passport-citrix').Strategy;
var User           = require('../app/models/user');
var Channel        = require('../app/models/channel');

var CONFIG = Channel.syncFindByType('channel:gotomeeting').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var citrixStrategy = new CitrixStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:gotomeeting', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = citrixStrategy;
