var request = require('request');
var when = require('when');
var Channel = require('../models/channel');
var User = require('../models/user');
var channelId = '54aef7242fb43e73e214bb39';

function getSessionCookie(){
  return when.promise(function(resolve, reject){
    request.get({
      url: 'https://portal.vn.teslamotors.com/vehicles'
    }, function(err, httpResponse, body) {
      var headersCookie = httpResponse.headers['set-cookie'] || []
      var sessionCookie = headersCookie[0]
      if(err || !sessionCookie){
        reject(err)
      }else{
        resolve(sessionCookie)
      }
    });
  });
}

function getUserCookie(username, password){
  return when.promise(function(resolve, reject){
    request.post({
        url: 'https://portal.vn.teslamotors.com/login',
        form: {
          'user_session[email]' : username,
          'user_session[password]' : password,
        },
        followAllRedirects : true
      }, function(err, httpResponse, body) {
        var headersCookie = httpResponse.headers['set-cookie'] || []
        var userCookie = headersCookie[0]
        if(err || !userCookie){
          reject(err)
        }else{
          console.log(userCookie);
          resolve(userCookie)
        }
    });
  });
}


var TeslaController = function(){
  this.authorize = function(req, res, next){
    var sessionCookie, userCookie;
    getSessionCookie()
    .then(function(_sessionCookie){
      return sessionCookie = _sessionCookie;
    })
    .then(getUserCookie())
    .then(function(_userCookie){
      return userCookie = _userCookie;
    })
    .then(function(){
      console.log('Telsa Stuff', sessionCookie, userCookie)
      return;
      if (err || !sessionCookie || !userCookie) {
        console.error('Tesla Auth Failed:', err, headersCookie, sessionCookie, userCookie);
        next(err || new Error("Tesla Auth Failed"))
        return;
      }
      User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'tesla', token : sessionCookie});
      User.update({_id: req.user._id}, req.user).then(function(){
        next();
      }).catch(function(error){
        next(error);
      });
    });
  };
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = TeslaController;
