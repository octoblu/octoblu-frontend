var request = require('request');
var when = require('when');
var Channel = require('../models/channel');
var User = require('../models/user');

var CONFIG = Channel.syncFindByType('channel:wit-ai');

function authenticate(token){
  return when.promise(function(resolve, reject){
    request.post({
        json : {'github_token' : token},
        headers: {
          'User-Agent': 'Octoblu/1.0.0',
          'Accept': 'application/vnd.wit.20141022+json'
        },
        url: 'https://api.wit.ai/github_authorize_url'
      }, function(err, httpResponse, body) {
        if(err){
          return reject(err)
        }
        if (!body.access_token){
          return reject(new Error('Failed to authenticate with Wit.ai'));
        }
        resolve(body.access_token);
    });
  });
}

var WitAIController = function(){
  this.authorize = function(req, res, next){
    var channel = User.findApiByChannelType(req.user.api, 'channel:github');
    authenticate(channel.token)
      .then(function(accessToken){
        User.addApiAuthorization(req.user, 'channel:wit-ai', {authtype: 'oauth', token: accessToken})
          .then(function () {
            next(null, req.user);
          }).catch(function(error){
            next(error);
          });
      }, next);
  };
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = WitAIController;
