var FourSquare = require('passport-foursquare').Strategy;
var mongoose = require('mongoose');
var User     = require('../app/models/user');
var Channel = require('../app/models/channel');
var mongojs = require('mongojs');

var CONFIG = Channel.syncFindById('52f9b628ebbb409983000001').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var fourSquareStrategy = new FourSquare(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = mongojs.ObjectId('52f9b628ebbb409983000001');

  User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token: accessToken});
  User.update(req.user).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = fourSquareStrategy;
