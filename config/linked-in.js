var LinkedinController = require('passport-linkedin-oauth2').Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Channel = require('../app/models/channel');

var config = Channel.syncFindById('52f97c5ba990930c8c0003ca').oauth[process.env.NODE_ENV];

config.passReqToCallback = true;

if(!config.clientID){
	config.clientID = config.consumerKey;
}

if(!config.clientSecret){
	config.clientSecret = config.consumerSecret;
}

var linkedinStrategy = new LinkedinController(config, function(req, accessToken, refreshToken, profile, done){
  var channelId = new mongoose.Types.ObjectId('52f97c5ba990930c8c0003ca');
  console.log('AccessToken', accessToken);
  req.user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: accessToken});
  req.user.save(function (err) {
    return done(err, req.user);
  });
});

module.exports = linkedinStrategy;
