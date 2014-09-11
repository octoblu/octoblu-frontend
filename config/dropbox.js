var DropboxStrategy = require('passport-dropbox-oauth2').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');

var CONFIG = {
  development: {
    clientID:     'INSERT_SECERT_HERE',
    clientSecret: 'INSERT_SECERT_HERE',
    callbackURL:    'http://localhost:8080/api/oauth/dropbox/callback',
    passReqToCallback: true
  }
}[process.env.NODE_ENV];

var dropboxStrategy = new DropboxStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = new mongoose.Types.ObjectId('532a60c06d3281aa4aeacab3');

  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: accessToken});
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = dropboxStrategy;
