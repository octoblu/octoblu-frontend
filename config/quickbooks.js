'use strict';
var QuickBooksStrategy = require('passport-intuit-oauth').Strategy;
var User               = require('../app/models/user');
var Channel            = require('../app/models/channel');

var CONFIG = Channel.syncFindByType('channel:quickbooks').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var quickBooksStrategy = new QuickBooksStrategy(CONFIG, function(req, accessToken, secret, profile, done){

  User.addApiAuthorization(req.user, 'channel:quickbooks', {authtype: 'oauth', token: accessToken, secret: secret}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = quickBooksStrategy;
