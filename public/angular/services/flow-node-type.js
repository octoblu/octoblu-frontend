'use strict';
angular.module('octobluApp')
    .service('FlowNodeTypeService', function ($http) {
        return {
            getFlowNodeTypes: function () {
               return $http.get('/api/flow_node_types', {cache: true})
                   .then(function(res){
                       return res.data;
                   });
            }
        };
    });

