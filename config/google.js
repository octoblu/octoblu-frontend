var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');

var CONFIG = {
  development: {
    clientID     : 'INSERT_SECERT_HERE',
    clientSecret : 'INSERT_SECERT_HERE',
    callbackURL  : 'http://localhost:8080/api/oauth/google/callback',
    passReqToCallback: true
  },
  production: {
    clientID     : 'INSERT_SECERT_HERE',
    clientSecret : 'INSERT_SECERT_HERE',
    callbackURL  : 'https://app.octoblu.com/api/oauth/google/callback',
    passReqToCallback: true
  },
  staging: {
    clientID     : 'INSERT_SECERT_HERE',
    clientSecret : 'INSERT_SECERT_HERE',
    callbackURL  : 'https://staging.octoblu.com/api/oauth/google/callback',
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

  query = {'google.id': profile.id};
  userParams = {
    username:    profile.emails[0].value,
    displayName: profile.displayName,
    email:       profile.emails[0].value,
    twitter: {
      id: profile.id
    }
  };

  User.findOneAndUpdate(query, {$set: userParams}, {upsert: upsert, new: upsert}).exec()
  .then(function (user) {
    callback(null, user);
  }, function(err){
    callback(err);
  });
}

var googleStrategy = new GoogleStrategy(CONFIG,
  function (req, token, secret, profile, done) {
  ensureUser(req, req.user, profile, function(err, user){
    done(err, user);
  });
});

module.exports = googleStrategy;
