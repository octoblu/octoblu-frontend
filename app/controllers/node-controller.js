var NodeController = function(options){
  var self = this;
  var NodeCollection = require('../collections/node-collection');

  self.index = function(req, res){
    var collection = self.getNodeCollection(req.user.skynet.uuid);
    collection.fetch().then(function(nodes){
      res.send(200, nodes);
    });
  };

  self.getNodeCollection = function(uuid){
    return new NodeCollection(uuid);
  }

  return self;
}

module.exports = NodeController;
