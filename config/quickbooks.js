var QuickBooksStrategy = require('passport-intuit-oauth').Strategy;
var User     = require('../app/models/user');
var Channel = require('../app/models/channel');
var mongojs = require('mongojs');

var channel = Channel.syncFindByType('channel:quickbooks');
var CONFIG = channel.oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var quickBooksStrategy = new QuickBooksStrategy(CONFIG, function(req, accessToken, secret, profile, done){
  var channelId = mongojs.ObjectId('54332209575a54b586a6b4c0');
	var auth = {authtype: 'oauth', token: accessToken, secret: secret};
  User.overwriteOrAddApiByChannelId(req.user, channelId, auth);
  User.update(req.user).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = quickBooksStrategy;
