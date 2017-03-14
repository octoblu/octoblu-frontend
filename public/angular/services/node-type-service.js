angular.module('octobluApp')
.service('NodeTypeService', function (NodeService, $http, $q, OCTOBLU_API_URL, DeviceLogo) {
  'use strict';

  var self = this;

  self.getNodeTypes = function(){
    return $http.get(OCTOBLU_API_URL + '/api/node_types', {cache:true}).then(function(res){
      var nodeTypes = _.filter(res.data, function(data){
        return data.enabled;
      });

      return _.map(nodeTypes, self.addLogo);
    });
  };

  self.getSubdeviceNodeTypes = function(){
    return self.getNodeTypes().then(function(nodeTypes){
      return _.filter(nodeTypes, 'connector');
    })
  };

  self.getUnconfiguredNodeTypes = function() {
    return self.getNodeTypes()
      .then(self.removeConfiguredNodes);
  };

  self.removeConfiguredNodes = function(nodeTypes) {
    return NodeService.getNodes()
      .then(function(configuredNodes){
        return _.filter(nodeTypes, function(nodeType){
          if(nodeType.category !== 'channel') {
            return true;
          }
          return ! _.find(configuredNodes, { channelid:  nodeType.channelid});
        });
      });
  }

  self.addLogo = function(node){
    node.logo = new DeviceLogo(node).get();
    return node;
  };

  self.getNodeTypeById = function(id){
    return self.getNodeTypes().then(function(nodeTypes){
      return _.find(nodeTypes, {_id: id});
    });
  };

  self.getNodeTypeByType = function(type){
    return self.getNodeTypes().then(function(nodeTypes){
      return _.find(nodeTypes, {type: type});
    });
  };

  self.getNodeTypeByObject = function(node){
    return self.getNodeTypes().then(function(nodeTypes){
      return _.defaults(node, _.find(nodeTypes, {type: node.type}));
    });
  };

  self.getById = self.getNodeTypeById;

  return self;
});
