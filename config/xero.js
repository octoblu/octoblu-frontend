'use strict';
var XeroStrategy = require('passport-xero').Strategy;
var User     = require('../app/models/user');
var Channel = require('../app/models/channel');

var CONFIG = Channel.syncFindByType('channel:xero').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var xeroStrategy = new XeroStrategy(CONFIG, function(req, accessToken, secret, profile, done){
  User.addApiAuthorization(req.user, 'channel:xero', {authtype: 'oauth',  token: accessToken, secret: secret}).then(function(){
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = xeroStrategy;
