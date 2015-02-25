var User = require('../models/user');
var textCrypt = require('../lib/textCrypt');
function ChannelGooglePlacesController(){
  var self = this;

  self.create = function(req, res){
    var channelId = req.params.id;

    var AccessTokenQueryStrategy = function(requestParams, dynamicNode) {
      var tokenKey = dynamicNode.oauth.tokenQueryParam;
      requestParams.qs = requestParams.qs || {};
      requestParams.qs[tokenKey] = dynamicNode.oauth.access_token;
      return requestParams;
    };

    User.overwriteOrAddApiByChannelId(req.user, channelId, { authtype: 'oauth', token_crypt : textCrypt.encrypt(req.body.apikey), secret_crypt: textCrypt.encrypt("") });
    User.update({_id: req.user._id}, req.user).then(function(){
      res.send(201);
    }).catch(function(error){
      console.error(error);
      res.send(422);
    });
  };
}

module.exports = ChannelGooglePlacesController;
