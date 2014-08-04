'use strict';
angular.module('octobluApp')
    .service('FlowNodeTypeService', function ($http) {
        var service = this;

        service.getFlowNodeType  = function(type){
          return service.getFlowNodeTypes().then(function(flowNodeTypes){
            return _.findWhere(flowNodeTypes, {type : type});
          });
        };

        service.getFlowNodeTypes = function () {
          return $http.get('/api/flow/node_types', {cache: true}).then(function(res){
            return res.data;
          });
        };

        return service;
    });

