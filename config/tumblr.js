'use strict';
var TumblrStrategy = require('passport-tumblr').Strategy;
var User           = require('../app/models/user');
var Channel        = require('../app/models/channel');

var CONFIG = Channel.syncFindByType('channel:tumblr').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var tumblrStrategy = new TumblrStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:tumblr', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = tumblrStrategy;
