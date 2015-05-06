angular.module('octobluApp')
.service('BillOfMaterialsService', function ($q, NodeTypeService) {
  'use strict';
  var self = this;

  self.getNodes = function(flow) {
    var materialNodes = _.reject(flow.nodes, function(node){
      return node.type && node.type.indexOf('operation') === 0;
    });

    var nodes = _.map(materialNodes, function(node){
      return _.pick(node, ['type', 'logo', 'name']);
    })

    return _.uniq(nodes);

  };

  self.generate = function(flow) {
    var nodes = self.getNodes(flow);
    return $q.all( _.map(nodes, NodeTypeService.getNodeTypeByObject) );
  }

  return self;
});
