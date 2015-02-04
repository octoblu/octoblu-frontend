var request = require('request');
var when = require('when');
var Channel = require('../models/channel');
var User = require('../models/user');

var CONFIG = Channel.syncFindOauthConfigByType('channel:travis-ci');

function authenticate(token){
  return when.promise(function(resolve, reject){
    request.post({
        json : {'github_token' : token},
        headers: {
          'User-Agent': 'Octoblu/1.0.0',
          'Accept': 'application/vnd.travis-ci.2+json'
        },
        url: 'https://api.travis-ci.org/auth/github'
      }, function(err, httpResponse, body) {
        if(err){
          return reject(err)
        }
        if (!body.access_token){
          return reject(new Error('Failed to authenticate with Travis CI'));
        }
        console.log('ACCESSTOKEN', body.access_token);
        resolve(body.access_token);
    });
  });
}

var TravisCIController = function(){
  this.authorize = function(req, res, next){
    var channel = User.findApiByChannelType(req.user.api, 'channel:github');
    authenticate(channel.token)
      .then(function(accessToken){
        User.addApiAuthorization(req.user, 'channel:travis-ci', {authtype: 'oauth', token: accessToken})
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

module.exports = TravisCIController;
