angular.module('octobluApp')
.service('OmniService', function(FlowNodeTypeService, NodeTypeService, FlowService, $q) {
  'use strict';
  var self, flowNodes, flowNodeTypes, nodeTypes;
  self = this;

  flowNodes     = [];
  flowNodeTypes = [];
  nodeTypes     = [];

  self.fetch = function(omniItems) {
    var getFlowNodeTypes, getNodeTypes;

    getNodeTypes     = NodeTypeService.getNodeTypes();

    flowNodes = omniItems;

    return $q.all([self.getFlowNodeTypes(), getNodeTypes]).then(function(results){
      return _.union(omniItems, _.flatten(results, true));
    });
  };

  self.getFlowNodeTypes = function(){
    return FlowNodeTypeService.getFlowNodeTypes().then(function(theFlowNodeTypes){
      flowNodeTypes = theFlowNodeTypes;
      return flowNodeTypes;
    });
  };

  self.selectItem = function(item){
    if(_.contains(flowNodeTypes, item)){
      FlowService.addNodeFromFlowNodeType(item);
      return $q.when(null);
    }

    if(_.contains(flowNodes, item)) {
      FlowService.selectNode(item);
      return $q.when(null);
    }

    return $q.when(item);
  };
});
