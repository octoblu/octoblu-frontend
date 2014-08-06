'use strict';
angular.module('octobluApp')
    .service('FlowNodeTypeService', function ($http) {
        var service = this;

        service.createFlowNode = function(flowNodeType){
          return {type : flowNodeType.name};
        };

        service.getFlowNodeType  = function(type){
          return service.getFlowNodeTypes().then(function(flowNodeTypes){
            return _.findWhere(flowNodeTypes, {name: type});
          });
        };

        service.getFlowNodeTypes = function () {
          return $http.get('/api/flow_node_types', {cache: true}).then(function(res){
            return res.data;
          });
        };

        return service;
    });

