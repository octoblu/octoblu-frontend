angular.module('octobluApp')
.service('BillOfMaterialsService', function (NodeTypeService) {
  'use strict';
  var self = this;

  self.generate = function(flow) {
    var materialNodes = _.reject(flow.nodes, function(node){
      return node.type && node.type.indexOf('operation') === 0;
    });

    return _.map( _.uniq(materialNodes, 'type'), function(node) {
      node = NodeTypeService.addLogo(node);
      return { type: node.type, logo: node.logo };
    });

  };

  return self; 
});
