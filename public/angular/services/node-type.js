'use strict';
angular.module('octobluApp')
    .service('NodeTypeService', function ($http, $q) {
        'use strict';
        var myNodeTypes, service;
        myNodeTypes = [];

        service = {
            getNodeTypes : function(){
                if(!_.isEmpty(myNodeTypes)) {
                    var defer = $q.defer();
                    defer.resolve(myNodeTypes);
                    return defer.promise;
                }

                return $http.get('/api/nodetype').then(function(res){
                    angular.copy(res.data, myNodeTypes);
                    return myNodeTypes;
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

