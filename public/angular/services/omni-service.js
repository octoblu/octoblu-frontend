angular.module('octobluApp')
  .service('OmniService', function (FlowNodeTypeService, NodeTypeService, FlowService, $q) {
    'use strict';
    var self, flowNodes, flowNodeTypes;
    self = this;

    flowNodes = [];
    flowNodeTypes = [];

    self.fetch = function (omniItems) {
      flowNodes = omniItems;
      return $q.all([self.getFlowNodeTypes(), NodeTypeService.getNodeTypes()]).then(function (results) {
        return _.union(omniItems, _.flatten(results, true));
      });
    };

    self.getFlowNodeTypes = function () {
      return FlowNodeTypeService.getFlowNodeTypes().then(function (theFlowNodeTypes) {
        flowNodeTypes = theFlowNodeTypes;
        return flowNodeTypes;
      });
    };

    self.selectItem = function (item) {
      if (item.resourceType === 'flow-node-type'){
        FlowService.addNodeFromFlowNodeType(item);
        return;
      }

      FlowService.selectNode(item);
    };
  });
