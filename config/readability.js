'use strict';
var ReadabilityStrategy = require('passport-readability').Strategy;
var User         = require('../app/models/user');
var Channel      = require('../app/models/channel');

var CONFIG = Channel.syncFindByType('channel:readability').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var readabilityStrategy = new ReadabilityStrategy(CONFIG, function(req, accessToken, secret, profile, done){

  User.addApiAuthorization(req.user, 'channel:readability', {authtype: 'oauth', token: accessToken, secret: secret}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = readabilityStrategy;
