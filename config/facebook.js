'use strict';
var FacebookStrategy = require('passport-facebook').Strategy;
var User           = require('../app/models/user');
var Channel        = require('../app/models/channel');
var _              = require('lodash');

var CONFIG = Channel.syncFindByType('channel:facebook').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var ensureUser = function(req, user, profile, callback){
  if(user){ return callback(null, user); }
  var query, userParams;

  query = {'facebook.id': profile.id};

  userParams = {
    username:    profile.emails[0].value,
    displayName: profile.emails[0].value,
    email:       profile.emails[0].value,
    facebook: {
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

    if (!req.session.testerId) {
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

var facebookStrategy = new FacebookStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  ensureUser(req, req.user, profile, function(err, user){
    if(err){ return done(err, user); }

    User.addApiAuthorization(user, 'channel:facebook', {authtype: 'oauth', token: accessToken}).then(function(){
      done(null, user);
    }).catch(function(error){
      done(error);
    });
  });
});

module.exports = facebookStrategy;
