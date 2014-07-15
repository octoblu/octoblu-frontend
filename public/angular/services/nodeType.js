ngular.module('octobluApp')
    .service('NodeTypeService', function ($http) {
        return {
            getNodeTypes : function(){
                return $http.get('/api/nodetype').then(function(res){
                    return res.data;
                })
            }
        };
    });

