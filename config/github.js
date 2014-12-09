'use strict';
var GithubStrategy = require('passport-github').Strategy;
var User           = require('../app/models/user');
var Channel        = require('../app/models/channel');
var _              = require('lodash');

var CONFIG = Channel.syncFindOauthConfigByType('channel:github');

CONFIG.passReqToCallback = true;

var ensureUser = function(req, user, profile, callback){
  if(user){ return callback(null, user); }
  var query, userParams;

  query = {'github.id': profile.id};

  userParams = {
    username:    profile.username,
    displayName: profile.username,
    email:       profile.username,
    github: {
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

    if (process.env.INVITATION_REQUIRED && !req.session.testerId) {
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

var githubStrategy = new GithubStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  ensureUser(req, req.user, profile, function(err, user){
    if(err){ return done(err, user); }

    User.addApiAuthorization(user, 'channel:github', {authtype: 'oauth', token: accessToken}).then(function(){
      done(null, user);
    }).catch(function(error){
      done(error);
    });
  });
});

module.exports = githubStrategy;
