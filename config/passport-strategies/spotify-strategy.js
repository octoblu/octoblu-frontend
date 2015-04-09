'use strict';
var SpotifyStrategy = require('passport-spotify').Strategy;
var User            = require('../../app/models/user');
var Channel         = require('../../app/models/channel');

var CONFIG = Channel.syncFindOauthConfigByType('channel:spotify');

CONFIG.passReqToCallback = true;

var spotifyStrategy = new SpotifyStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:spotify', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = spotifyStrategy;
