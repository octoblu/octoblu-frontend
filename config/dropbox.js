'use strict';
var DropboxStrategy = require('passport-dropbox-oauth2').Strategy;
var User            = require('../app/models/user');
var Channel         = require('../app/models/channel');

var CONFIG = Channel.syncFindByType('channel:dropbox').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var dropboxStrategy = new DropboxStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:dropbox', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = dropboxStrategy;
