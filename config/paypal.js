var PaypalStrategy = require('passport-paypal').Strategy;
var User     = require('../app/models/user');
var Channel = require('../app/models/channel');
var url = require('url');
var mongojs = require('mongojs');

var channel = Channel.syncFindByType('channel:paypal');
var CONFIG = channel.oauth[process.env.NODE_ENV];

var uri = url.parse(CONFIG.callbackURL);
var realm = uri.protocol + '//' + uri.host + '/';

CONFIG.returnURL = CONFIG.callbackURL;
CONFIG.realm = realm;
CONFIG.passReqToCallback = true;

console.log('REALM', realm);

var paypalStrategy = new PaypalStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = mongojs.ObjectId(channel._id);

  User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token: accessToken});
  User.update(req.user).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = paypalStrategy;
