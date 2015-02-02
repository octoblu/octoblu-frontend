var request = require('request');
var when = require('when');
var Channel = require('../models/channel');
var User = require('../models/user');
var channelId = '54aef7242fb43e73e214bb39';

var CONFIG = Channel.syncFindOauthConfigByType('channel:tesla');

function authenticate(username, password){
  return when.promise(function(resolve, reject){
    request.post({
        url: 'https://owner-api.teslamotors.com/oauth/token',
        form: {
          'grant_type': 'password',
          'client_id': CONFIG.clientID,
          'client_secret': CONFIG.clientSecret,
          'email' : username,
          'password' : password,
        }
      }, function(err, httpResponse, body) {
        var token, auth_body;
        if(err){
          return reject(err)
        }
        try{
          auth_body = JSON.parse(body);
          token = auth_body.access_token;
        }catch(e){
          console.log('Unable to parse body for tesla api');
          return reject(e);
        }
        resolve(token);
    });
  });
}

var TeslaController = function(){
  this.authorize = function(req, res, next){
    authenticate(req.body.username, req.body.password)
      .then(function(accessToken){
       User.addApiAuthorization(req.user, 'channel:tesla', {authtype: 'oauth', token: accessToken})
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

module.exports = TeslaController;
