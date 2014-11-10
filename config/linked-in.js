'use strict';
var LinkedinController = require('passport-linkedin-oauth2').Strategy;
var User               = require('../app/models/user');
var Channel            = require('../app/models/channel');

var CONFIG = Channel.syncFindByType('channel:linked-in').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var linkedinStrategy = new LinkedinController(CONFIG, function(req, accessToken, refreshToken, profile, done){
  
  User.addApiAuthorization(req.user, 'channel:linked-in', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = linkedinStrategy;
