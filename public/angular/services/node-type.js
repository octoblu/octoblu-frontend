angular.module('octobluApp')
    .service('NodeTypeService', function ($http) {
        return service = {
            getNodeTypes : function(){
                return $http.get('/api/nodetype').then(function(res){
                    return res.data;
                })
            },

            getNodeTypeById: function(id){
                return service.getNodeTypes().then(function(nodeTypes){
                    return _.findWhere(nodeTypes, {_id: id});
                });
            }
        };
    });

