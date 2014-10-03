var FourSquare = require('passport-foursquare').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Channel = require('../app/models/channel');

var CONFIG = Channel.syncFindById('52f9b628ebbb409983000001').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var fourSquareStrategy = new FourSquare(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = new mongoose.Types.ObjectId('52f9b628ebbb409983000001');

  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: accessToken});
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = fourSquareStrategy;
