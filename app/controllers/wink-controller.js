'use strict';
var request = require('request');
var User = require('../models/user');
var Channel = require('../models/channel');

var CONFIG = Channel.syncFindOauthConfigByType('channel:wink');

CONFIG.passReqToCallback = true;

var winkController = function() {
  this.authorize = function(req, res, next) {
    request.post({
        url: 'https://winkapi.quirky.com/oauth2/token',
        json: {
          'client_id': CONFIG.clientID,
          'client_secret': CONFIG.clientSecret,
          'username': req.body.username,
          'password': req.body.password,
          'grant_type': 'password'
        },
        followAllRedirects: true
      },
      function(err, httpResponse, body) {
        if (err || httpResponse.statusCode >= 400) {
          return res.redirect('/home');
        }        

        User.addApiAuthorization(req.user, 'channel:wink', {
            authtype: 'access_token_bearer',
            token: body.access_token
          })
          .then(function() {
            next();
          })
          .catch(function(error) {
            res.send(500, error);
          });
      });
  };

  this.redirectToDesigner = function(req, res) {
    res.redirect('/design');
  };

};

module.exports = winkController;