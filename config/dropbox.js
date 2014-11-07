var DropboxStrategy = require('passport-dropbox-oauth2').Strategy;
var User     = require('../app/models/user');

var CONFIG = {
  development: {
    clientID:     'INSERT_SECERT_HERE',
    clientSecret: 'INSERT_SECERT_HERE',
    callbackURL:    'http://localhost:8080/api/oauth/dropbox/callback',
    passReqToCallback: true
  },
  production: {
    clientID:     'INSERT_SECERT_HERE',
    clientSecret: 'INSERT_SECERT_HERE',
    callbackURL:    'https://app.octoblu.com/api/oauth/dropbox/callback',
    passReqToCallback: true
  },
  staging: {
    clientID:     'INSERT_SECERT_HERE',
    clientSecret: 'INSERT_SECERT_HERE',
    callbackURL:    'https://staging.octoblu.com/api/oauth/dropbox/callback',
    passReqToCallback: true
  }
}[process.env.NODE_ENV];

var dropboxStrategy = new DropboxStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = new mongoose.Types.ObjectId('532a60c06d3281aa4aeacab3');

  User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token: accessToken});
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = dropboxStrategy;
