var User = require('../models/user');
var textCrypt = require('../lib/textCrypt');
function ChannelAWSAuthController(){
  var self = this;

  self.create = function(req, res){
    var channelId = req.params.id;

    User.overwriteOrAddApiByChannelId(req.user, channelId, { authtype: 'aws', token_crypt : textCrypt.encrypt(req.body.username), secret_crypt : textCrypt.encrypt(req.body.password) });
    User.update({_id: req.user._id}, req.user).then(function(){
      res.send(201);
    }).catch(function(error){
      console.error(error);
      res.send(422);
    });
  }
}

module.exports = ChannelAWSAuthController;
