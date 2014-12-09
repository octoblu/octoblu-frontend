'use strict';
var SalesForceStrategy = require('passport-forcedotcom').Strategy;
var User               = require('../app/models/user');
var Channel            = require('../app/models/channel');

var CONFIG = Channel.syncFindOauthConfigByType('channel:salesforce');

CONFIG.passReqToCallback = true;
CONFIG.scope = ['id','chatter_api', 'api', 'full', 'refresh_token', 'visualforce', 'web'];

var salesForceStrategy = new SalesForceStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:salesforce', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = salesForceStrategy;
