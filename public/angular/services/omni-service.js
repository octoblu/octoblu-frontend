angular.module('octobluApp')
  .service('OmniService', function (FlowNodeTypeService, NodeTypeService, FlowService, $q) {
    'use strict';
    var self, flowNodes, flowNodeTypes, nodeTypes;
    self = this;

    flowNodes = [];
    flowNodeTypes = [];
    nodeTypes = [];

    self.fetch = function (omniItems) {
      var getFlowNodeTypes, getNodeTypes;

      getNodeTypes = NodeTypeService.getNodeTypes();

      flowNodes = omniItems;

      return $q.all([self.getFlowNodeTypes(), getNodeTypes]).then(function (results) {
        omniItems = _.map(omniItems, function (omniItem) {
        var newOmniItem = _.clone(omniItem);
          newOmniItem.omniType = 'flow-node';
          return newOmniItem;
        });

        var flowNodeTypes = _.map(results[0], function (flowNodeType) {
          flowNodeType.omniType = 'flow-node-type';
          return flowNodeType;
        });

        var nodeTypes = _.map(results[1], function (nodeType) {
          nodeType.omniType = 'node-type';
          return nodeType;
        });

        return _.union(omniItems, flowNodeTypes, nodeTypes);
      });
    };

    self.getFlowNodeTypes = function () {
      return FlowNodeTypeService.getFlowNodeTypes().then(function (theFlowNodeTypes) {
        flowNodeTypes = theFlowNodeTypes;
        return flowNodeTypes;
      });
    };

    self.selectItem = function (item) {
      var flowNodeType, flowNode;

      flowNodeType = _.find(flowNodeTypes, function (flowNodeType) {
        return _.isEqual(angular.toJson(item), angular.toJson(flowNodeType));
      });

      if (flowNodeType) {
        FlowService.addNodeFromFlowNodeType(item);
        return $q.when(null);
      }

      flowNode = _.find(flowNodes, function (flowNode) {
        return _.isEqual(angular.toJson(item), angular.toJson(flowNode));
      });

      if (flowNode) {
        FlowService.selectNode(item);
        return $q.when(null);
      }

      return $q.when(item);
    };
  });
