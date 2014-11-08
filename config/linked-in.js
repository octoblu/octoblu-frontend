var LinkedinController = require('passport-linkedin-oauth2').Strategy;
var User     = require('../app/models/user');
var Channel = require('../app/models/channel');
var mongojs = require('mongojs');

var config = Channel.syncFindById('52f97c5ba990930c8c0003ca').oauth[process.env.NODE_ENV];

config.passReqToCallback = true;

if(!config.clientID){
	config.clientID = config.consumerKey;
}

if(!config.clientSecret){
	config.clientSecret = config.consumerSecret;
}

var linkedinStrategy = new LinkedinController(config, function(req, accessToken, refreshToken, profile, done){
  var channelId = mongojs.ObjectId('52f97c5ba990930c8c0003ca');
  User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token: accessToken});
  User.update(req.user).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = linkedinStrategy;
