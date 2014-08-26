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

                return $http.get('/api/node_types').then(function(res){
                    myNodeTypes.push.apply(myNodeTypes, res.data);
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

