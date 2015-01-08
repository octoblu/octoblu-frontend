var request = require('request');
var Channel = require('../models/channel');
var User = require('../models/user');
var channelId = '54aef7242fb43e73e214bb39';

var TeslaController = function(){
  this.authorize = function(req, res, next){
    request.post({
        url: 'https://portal.vn.teslamotors.com/login',
        form: {
          user_session: {
            email : req.body.username,
            password: req.body.password
          }
        },
        followAllRedirects : true
      }, function(err, httpResponse, body) {
        var headersCookie = httpResponse.headers['set-cookie'] || []
        var sessionCookie = headersCookie[0]
        if (err || !sessionCookie) {
          console.error('Tesla Auth Failed:', err, headersCookie, sessionCookie);
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
