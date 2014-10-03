var _ = require('lodash');

var NodeController = function(options){
  var self, NodeController, addResourceType,
  self = this,
  NodeCollection = require('../collections/node-collection');

  self.index = function(req, res){
    var collection = self.getNodeCollection(req.user.skynet.uuid);
    collection.fetch().then(function(nodes){
      res.send(200, addResourceType(nodes));
    });
  };

  self.getNodeCollection = function(uuid){
    return new NodeCollection(uuid);
  };

  addResourceType = function(items){
    return _.map(items, function(item){
      return _.extend({resourceType: 'node'}, item);
    });
  }
};

module.exports = NodeController;
