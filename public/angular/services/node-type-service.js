'use strict';
angular.module('octobluApp')
    .service('NodeTypeService', function ($http, $q) {
        'use strict';
        var myNodeTypes, service;
        myNodeTypes = [];

        service = {
            getNodeTypes : function(){
                return $http.get('/api/node_types').then(function(res){
                    return res.data;
                });
            },

            getNodeTypeById: function(id){
                return service.getNodeTypes().then(function(nodeTypes){
                    return _.findWhere(nodeTypes, {_id: id});
                });
            }
        };

        return service;
    });

