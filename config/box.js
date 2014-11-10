'use strict';
var BoxStrategy = require('passport-box').Strategy;
var User        = require('../app/models/user');
var Channel     = require('../app/models/channel');

var CONFIG = Channel.syncFindByType('channel:box').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var boxStrategy = new BoxStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:box', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = boxStrategy;
