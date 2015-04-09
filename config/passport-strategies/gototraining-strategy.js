'use strict';
var GoToTrainingStrategy = require('passport-citrix').Strategy;
var User            = require('../../app/models/user');
var Channel         = require('../../app/models/channel');

var CONFIG = Channel.syncFindOauthConfigByType('channel:gototraining');

CONFIG.passReqToCallback = true;
CONFIG.name = 'gototraining';

var goToTrainingStrategy = new GoToTrainingStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:gototraining', {authtype: 'oauth', token: accessToken}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = goToTrainingStrategy;
