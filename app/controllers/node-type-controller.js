var _ = require('lodash');
var NodeTypeCollection = require('../collections/node-type-collection');

var NodeTypeController = function(options){
  var self, nodeTypeCollection, addResourceType;
  self = this;

  options = options || {};
  nodeTypeCollection = options.nodeTypeCollection || new NodeTypeCollection();

  self.index = function(req, res){
    nodeTypeCollection.fetch(req.user._id).then(function(nodeTypes){
      res.send(200, addResourceType(nodeTypes));
    }).catch(function(error){
      res.send(500, error);
    });
  };

  addResourceType = function(items){
    return _.map(items, function(item){
      return _.extend({resourceType: 'node-type'}, item);
    });
  }
};

module.exports = NodeTypeController;
