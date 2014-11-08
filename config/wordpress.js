var WordPressStrategy = require('passport-wordpress').Strategy;
var User     = require('../app/models/user');
var Channel = require('../app/models/channel');
var mongojs = require('mongojs');

var CONFIG = Channel.syncFindById('5447dced5534771656d0fdf5').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var wordpressStrategy = new WordPressStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = mongojs.ObjectId('5447dced5534771656d0fdf5');

  User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token: accessToken});
  User.update(req.user).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = wordpressStrategy;
