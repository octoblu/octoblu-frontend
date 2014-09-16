var TwitterStrategy = require('passport-twitter').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');

var CONFIG = {
  development: {
    consumerKey : "jJtghQn41kzvaIdyjPA7by2W5",
    consumerSecret : "jt4tMJOFXazArxYu3efsv9WJ5aO2eWiQdtC0t05XzHAllqvuSW",
    callbackURL:    'http://localhost:8080/api/oauth/twitter/callback',
    passReqToCallback: true
  },
  production: {
    consumerKey : "di4CBlZkwJp7rJoaqP6fBA0yC",
    consumerSecret : "2Ndg7hDyGR0Roe3P2AQ5ttL7yG6lRmU1UQ9mjFn40HtBc5C073",
    callbackURL:    'https://app.octoblu.com/api/oauth/twitter/callback',
    passReqToCallback: true
  },
  staging: {
    consumerKey : "97w9x63DUmWcuYoKy4p8epWFu",
    consumerSecret : "n0b5smHWGP1cNpBT02sGqlg6JRQ2LZOrRtfM6X2I4DbegYuiLy",
    callbackURL:    'https://staging.octoblu.com/api/oauth/twitter/callback',
    passReqToCallback: true
  }
}[process.env.NODE_ENV];

var ensureUser = function(user, profile, callback){
  if(user){ return callback(null, user); }

  var query, userParams;

  query = {'twitter.id': profile.id};
  userParams = {
    username:    profile.username,
    displayName: profile.displayName,
    email:       profile.username,
    twitter: {
      id: profile.id
    }
  };

  User.findOneAndUpdate(query, {$set: userParams}, {upsert: false, new: false}).exec()
    .then(function (user) {
      callback(null, user);
    }, function(){
      callback(err);
    });
}

var twitterStrategy = new TwitterStrategy(CONFIG,
  function (req, token, secret, profile, done) {
  ensureUser(req.user, profile, function(err, user){
    if(err){ return done(err, user); }

    var channelId = new mongoose.Types.ObjectId('5409f79403f1d8b163401370');

    user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: token, secret: secret});
    user.save(function (err) {
      done(err, user);
    });
  });
});

module.exports = twitterStrategy;
