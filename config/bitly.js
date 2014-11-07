var BitlyStrategy = require('passport-bitly').Strategy;
var User     = require('../app/models/user');
var Channel = require('../app/models/channel');

var CONFIG = Channel.syncFindById('52f9b79febbb40641600000b').oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var bitlyStrategy = new BitlyStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  var channelId = new mongoose.Types.ObjectId('52f9b79febbb40641600000b');

  User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token: accessToken});
  User.update(req.user)then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = bitlyStrategy;
