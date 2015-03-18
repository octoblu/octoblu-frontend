var _ = require('lodash');

var NodeController = function(options){
  var self, NodeController, addResourceType,
  self = this,
  NodeCollection = require('../collections/node-collection');

  self.index = function(req, res){
    var uuid = req.cookies.meshblu_auth_uuid;
    var token = req.cookies.meshblu_auth_token;
    var collection = self.getNodeCollection(uuid, token);
    collection.fetch().then(function(nodes){
      res.send(200, addResourceType(nodes));
    });
  };

  self.getNodeCollection = function(uuid, token){
    return new NodeCollection(uuid, token);
  };

  addResourceType = function(items){
    return _.map(items, function(item){
      return _.extend({resourceType: 'node'}, item);
    });
  }
};

module.exports = NodeController;
