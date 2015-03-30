var passport = require('passport'),
		_ 			 = require('lodash');

var authenticate = function(options){
	options = options || {};
	return function(req, res, next){
		var channelActivation, sudomain, defaultParams;
		channelActivation = _.findWhere(req.user.api, { channelid : '53f616b5710850ee08e28482' });
		defaultParams = channelActivation.defaultParams || {};
		options.subdomain = defaultParams[':subdomain'];
		return passport.authenticate('uservoice', options)(req, res, next);
	};
};

var UserVoiceController = function(){
  this.authorize = authenticate();
  this.callback  = authenticate({ failureRedirect: '/design' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = UserVoiceController;
