angular.module('octobluApp')
.service('FlowNodeTypeService', function ($http, UUIDService) {
  'use strict';

  var self = this;

  self.createFlowNode = function(flowNodeType){
    var defaults = _.cloneDeep(flowNodeType.defaults);

    return _.defaults({id: UUIDService.v1(), resourceType: 'flow-node'}, defaults, flowNodeType);
  };

  self.getFlowNodeType  = function(type){
    return self.getFlowNodeTypes().then(function(flowNodeTypes){
      return _.findWhere(flowNodeTypes, {type: type});
    });
  };

  self.getFlowNodeTypes = function () {
    return $http.get('/api/flow_node_types', {cache: true}).then(function(res){
      return res.data;
    });
  };

  return self;
});

