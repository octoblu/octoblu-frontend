'use strict';
angular.module('octobluApp')
    .service('FlowNodeTypeService', function ($http, UUIDService) {
        var service = this;

        service.createFlowNode = function(flowNodeType){
          var defaults = _.cloneDeep(flowNodeType.defaults);

          return _.defaults({
            id      : UUIDService.v1(),
            type    : flowNodeType.name,
            class   : flowNodeType.class,
            input   : flowNodeType.input,
            output  : flowNodeType.output
          }, defaults);
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

