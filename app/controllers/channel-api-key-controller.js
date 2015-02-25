var User = require('../models/user');
var textCrypt = require('../lib/textCrypt');

function ChannelApiKeyController(){
  var self = this;

  self.create = function(req, res){    
    var channelId = req.params.id;
    var channelData = { authtype: 'apikey', apikey: req.body.apikey};
    User.overwriteOrAddApiByChannelId(req.user, channelId, channelData);
    User.update({_id: req.user._id}, req.user).then(function(){
      res.send(201);
    }).catch(function(error){
      console.error(error);
      res.send(422);
    });
  };
}

module.exports = ChannelApiKeyController;
