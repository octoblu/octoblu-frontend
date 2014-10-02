var User = require('../models/user');
function ChannelBasicAuthController(){
  var self = this;

  self.create = function(req, res){
    var channelId = req.params.id;

    req.user.overwriteOrAddApiByChannelId(channelId, { authtype: 'basic', token : req.body.username, secret : req.body.password });
    req.user.save(function(err){
      if(err){
        console.log('Error saving user', err);
        res.send(422);
        return;
      }
      res.send(201);
    });
  }
}

module.exports = ChannelBasicAuthController;
