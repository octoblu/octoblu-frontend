'use strict';
var PaypalStrategy = require('passport-paypal').Strategy;
var User           = require('../app/models/user');
var Channel        = require('../app/models/channel');
var url            = require('url');

var CONFIG = Channel.syncFindByType('channel:paypal').oauth[process.env.NODE_ENV];

var uri = url.parse(CONFIG.callbackURL);
var realm = uri.protocol + '//' + uri.host + '/';

CONFIG.returnURL = CONFIG.callbackURL;
CONFIG.realm = realm;
CONFIG.passReqToCallback = true;

var paypalStrategy = new PaypalStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:paypal', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = paypalStrategy;
