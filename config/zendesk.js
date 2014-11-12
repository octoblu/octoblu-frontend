'use strict';
var ZendeskStrategy = require('passport-zendesk').Strategy;
var User = require('../app/models/user');
var Channel = require('../app/models/channel');

var CONFIG = Channel.syncFindByType('channel:zendesk').oauth[process.env.NODE_ENV];
CONFIG.passReqToCallback = true;

var zendeskStrategy = new ZendeskStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done) {
  console.log("AT: ", accessToken);
  console.log("RT: ", refreshToken);
  User.addApiAuthorization(req.user, 'channel:zendesk', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = zendeskStrategy;