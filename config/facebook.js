var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose         = require('mongoose');
var User             = mongoose.model('User');

var CONFIG = {
  development: {
    clientID     : '125271024334065',
    clientSecret : '999a5e310b8934a3dd0bdc37c87f39a1',
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
    clientID     : '1476628102576653',
    clientSecret : 'd7173aef0ca4636201b38f369e9bda5f',
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

  User.findOneAndUpdate(query, {$set: userParams}, {upsert: upsert, new: upsert}).exec()
  .then(function (user) {
      if(!user){
        callback(new Error('You need a valid invitation code'));
      } else {
        callback(null, user);
      }
  }, function(err){
    callback(err);
  });
}

var facebookStrategy = new FacebookStrategy(CONFIG,
  function (req, token, secret, profile, done) {
    console.log('facebook callback called');

    ensureUser(req, req.user, profile, function(err, user){
      done(err, user);
    });
  });

module.exports = facebookStrategy;
