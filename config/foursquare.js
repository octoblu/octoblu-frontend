'use strict';
var FourSquare = require('passport-foursquare').Strategy;
var User       = require('../app/models/user');
var Channel    = require('../app/models/channel');

var CONFIG = Channel.syncFindByType('channel:foursquare').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var fourSquareStrategy = new FourSquare(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:foursquare', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = fourSquareStrategy;
