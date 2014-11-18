angular.module('octobluApp')
.service('BillOfMaterialsService', function ($q, NodeTypeService) {
  'use strict';
  var self = this;

  self.getTypes = function(flow) {
    var materialNodes = _.reject(flow.nodes, function(node){
      return node.type && node.type.indexOf('operation') === 0;
    });

    return _.uniq( _.pluck(materialNodes, 'type') );

  };

  self.generate = function(flow) {
    var types = self.getTypes(flow);
    return $q.all( _.map(types, NodeTypeService.getNodeTypeByType) );
  }

  return self; 
});
