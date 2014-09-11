var ChannelCollection = require('../collections/channel-collection');

var ChannelController = function(){
  var self = this;

  self.get = function(req, res){
    self.getChannelCollection().get(req.user.resource.uuid, req.params.id).then(res.send);
  };

  self.getChannelCollection = function(){
    return new ChannelCollection();
  };

};

module.exports = ChannelController;
