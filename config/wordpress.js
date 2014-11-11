'use strict';
var WordPressStrategy = require('passport-wordpress').Strategy;
var User              = require('../app/models/user');
var Channel           = require('../app/models/channel');

var CONFIG = Channel.syncFindByType('channel:wordpress').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var wordpressStrategy = new WordPressStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:wordpress', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = wordpressStrategy;
