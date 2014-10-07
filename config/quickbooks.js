var QuickBooksStrategy = require('passport-intuit-oauth').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Channel = require('../app/models/channel');

var channel = Channel.syncFindByType('channel:quickbooks');
var CONFIG = channel.oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var quickBooksStrategy = new QuickBooksStrategy(CONFIG, function(req, accessToken, secret, profile, done){
  var channelId = new mongoose.Types.ObjectId('54332209575a54b586a6b4c0');
	var auth = {authtype: 'oauth', token: accessToken, secret: secret};
  req.user.overwriteOrAddApiByChannelId(channelId, auth);
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = quickBooksStrategy;