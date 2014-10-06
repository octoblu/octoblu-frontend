var PaypalStrategy = require('passport-paypal').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Channel = require('../app/models/channel');
var url = require('url');

var channel = Channel.syncFindByType('channel:paypal');
var CONFIG = channel.oauth[process.env.NODE_ENV];

var uri = url.parse(CONFIG.callbackURL);
var realm = uri.protocol + '//' + uri.host + '/';

CONFIG.returnURL = CONFIG.callbackURL;
CONFIG.realm = realm;
CONFIG.passReqToCallback = true;

console.log('REALM', realm);

var paypalStrategy = new PaypalStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = new mongoose.Types.ObjectId(channel._id);

  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: accessToken});
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = paypalStrategy;
