var FacebookStrategy = require('passport-facebook').Strategy;
var User             = require('../app/models/user');
var mongojs          = require('mongojs');
var _ = require('lodash');

var CONFIG = {
  development: {
    clientID     : 'INSERT_SECERT_HERE',
    clientSecret : 'INSERT_SECERT_HERE',
    callbackURL  : 'http://localhost:8080/api/oauth/facebook/callback',
    passReqToCallback: true
  },
  production: {
    clientID     : 'INSERT_SECERT_HERE',
    clientSecret : 'INSERT_SECERT_HERE',
    callbackURL  : 'https://app.octoblu.com/api/oauth/facebook/callback',
    passReqToCallback: true
  },
  staging: {
    clientID     : 'INSERT_SECERT_HERE',
    clientSecret : 'INSERT_SECERT_HERE',
    callbackURL  : 'https://staging.octoblu.com/api/oauth/facebook/callback',
    passReqToCallback: true
  }
}[process.env.NODE_ENV];

var ensureUser = function(req, user, profile, callback){
  if(user){ return callback(null, user); }
  var query, userParams, upsert;

  upsert = false;

  if(req.session.testerId) {
    upsert = true;
  }

  query = {'facebook.id': profile.id};
  userParams = {
    username:    profile.emails[0].value,
    displayName: profile.emails[0].value,
    email:       profile.emails[0].value,
    facebook: {
      id: profile.id
    }
  };

  User.findOne(query).then(function(user){
    if (!user) {
      return;
    }
    var updatedUser = _.extend({}, user, userParams);
    return User.update(query, updatedUser, {upsert: upsert, new: upsert});
  }).then(function (user) {
      if(!user){
        callback(new Error('You need a valid invitation code'));
      } else {
        callback(null, updatedUser);
      }
  }).catch(function(error){
    callback(error);
  });
};

var facebookStrategy = new FacebookStrategy(CONFIG,
  function (req, token, secret, profile, done) {
    ensureUser(req, req.user, profile, function(err, user){
      done(err, user);
    });
  });

module.exports = facebookStrategy;
