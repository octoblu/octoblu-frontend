var request = require('request');
var when = require('when');
var Channel = require('../models/channel');
var User = require('../models/user');

var CONFIG = Channel.syncFindOauthConfigByType('channel:travis-ci');

function authenticateGithub(token){
  return when.promise(function(resolve, reject){
    request.post({
        qs: {'access_token' : token},
        json: {
          "scopes": [
            "read:org", "user:email", "repo_deployment",
            "repo:status", "write:repo_hook"
          ],
          "note": "temporary token to auth against travis"
        },
        url: 'https://api.github.com/authorizations'
      }, function(err, httpResponse, body) {
        if(err){
          return reject(err)
        }
        if (!body.token){
          return reject(new Error('Failed to authenticate with GitHub'));
        }
        resolve(body.token);
    });
  });
}

function authenticate(token){
  return when.promise(function(resolve, reject){
    request.post({
        body : '{"github_token" : "' + token + '"}',
        headers: {
          'User-Agent': 'Octoblu/1.0.0',
          'Accept': 'application/vnd.travis-ci.2+json'
        },
        url: 'https://travis-ci.org/auth/github'
      }, function(err, httpResponse, body) {
        console.log(httpResponse, body);
        if(err){
          return reject(err)
        }
        if (!body.access_token){
          return reject(new Error('Failed to authenticate with Travis CI'));
        }
        resolve(body.access_token);
    });
  });
}

var TravisCIController = function(){
  this.authorize = function(req, res, next){
    var channel = User.findApiByChannelType(req.user.api, 'channel:github');
    authenticate('7dacaa0666ace239f1b152163ce9f9ff38aca369')
      .then(function(accessToken){
        User.addApiAuthorization(req.user, 'channel:travis-ci', {authtype: 'travis-ci', token: accessToken})
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
