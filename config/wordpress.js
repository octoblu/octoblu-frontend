var WordPressStrategy = require('passport-wordpress').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Channel = require('../app/models/channel');

var CONFIG = Channel.syncFindById('5447dced5534771656d0fdf5').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var wordpressStrategy = new WordPressStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = new mongoose.Types.ObjectId('5447dced5534771656d0fdf5');

  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: accessToken});
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = wordpressStrategy;
