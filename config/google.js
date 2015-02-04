'use strict';
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User           = require('../app/models/user');
var Channel        = require('../app/models/channel');
var _              = require('lodash');
var when           = require('when');

var CONFIG = Channel.syncFindOauthConfigByType('channel:google-plus');

CONFIG.passReqToCallback = true;
var ensureUser = function(req, user, profile, callback){
  if(user){ return callback(null, user); }
  var query, userParams;

  query = {'google.id': profile.id};

  userParams = {
    username:    profile.emails[0].value,
    displayName: profile.displayName,
    email:       profile.emails[0].value,
    google: {
      id: profile.id
    }
  };

  User.findOne(query).then(function(user) {
    if (!_.isEmpty(user)){
      var updatedUser = _.extend({}, user, userParams);
      User.update({_id:user._id}, updatedUser);
      callback(null, updatedUser);
      return;
    }

    if (!req.session.sqrtofsaturn && process.env.INVITATION_REQUIRED && !req.session.testerId) {
      callback(new Error('You must have a valid invitation code'));
      return;
    }

    User.createOAuthUser(userParams).then(function(user){
      callback(null, user);
    });

  }).catch(function(error){
    callback(error);
  });
};

var googleStrategy = new GoogleStrategy(CONFIG,
  function (req, token, secret, profile, done) {
  ensureUser(req, req.user, profile, function(err, user){
    if(err){ return done(err, user); }

    when.all([
      User.addApiAuthorization(user, 'channel:google-drive', {authtype: 'oauth', token: token }),
      User.addApiAuthorization(user, 'channel:google-plus', {authtype: 'oauth', token: token }),
      User.addApiAuthorization(user, 'channel:youtube', {authtype: 'oauth', token: token }),
      User.addApiAuthorization(user, 'channel:doubleclicksearch', {authtype: 'oauth', token: token }),
      User.addApiAuthorization(user, 'channel:google-places', {authtype: 'oauth', token: token }),
    ]).then(function(){
      return User.findOne({_id: user._id});
    }).then(function(user){
      done(null, user);
    }).catch(function(error){
      done(error);
    });
  });
});

module.exports = googleStrategy;
