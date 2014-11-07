var DeliciousStrategy = require('passport-yahoo-oauth').Strategy;
var User              = require('../app/models/user');
var Channel           = require('../app/models/channel');

var channel = Channel.syncFindByType('channel:delicious');
var CONFIG = channel.oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var deliciousStrategy = new DeliciousStrategy(CONFIG, function(req, accessToken, secret, profile, done){
  var channelId = new mongoose.Types.ObjectId(channel._id);

  User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token: accessToken, secret: secret});
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = deliciousStrategy;
