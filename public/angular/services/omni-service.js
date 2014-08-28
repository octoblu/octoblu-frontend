angular.module('octobluApp')
.service('OmniService', function(FlowNodeTypeService, NodeTypeService, $q) {
  'use strict';
  var self = this;

  self.fetch = function(omniItems) {
    var getFlowNodeTypes = FlowNodeTypeService.getFlowNodeTypes();
    var getNodeTypes     = NodeTypeService.getNodeTypes();

    return $q.all([getFlowNodeTypes, getNodeTypes]).then(function(results){
      return _.union(omniItems, _.flatten(results, true));
    });
  };
});
