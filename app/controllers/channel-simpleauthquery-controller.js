var User = require('../models/user');
var textCrypt = require('../lib/textCrypt');

function ChannelSimpleAuthQUeryController(){
  var self = this;

  self.create = function(req, res){
    console.log('simpleauthquery', req.body);
    var channelId = req.params.id;
    var channelData = { 
      authtype: 'simpleauthquery', 
      userId : text.encrypt(req.body.userId), 
      password : text.encrypt(password), 
      domain : req.body.domain, 
      appKey : req.body.appKey
    };
    User.overwriteOrAddApiByChannelId(req.user, channelId, channelData);
    User.update({_id: req.user._id}, req.user).then(function(){
      res.send(201);
    }).catch(function(error){
      console.error(error);
      res.send(422);
    });
  };
}

module.exports = ChannelSimpleAuthQUeryController;