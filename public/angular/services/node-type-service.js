'use strict';
angular.module('octobluApp')
.service('NodeTypeService', function ($http, $q) {
  'use strict';
  var myNodeTypes, self;
  self = this;
  myNodeTypes = [];

  self.getNodeTypes = function(){
    return $http.get('/api/node_types').then(function(res){
      return res.data;
    });
  };

  self.getNodeTypeById = function(id){
    return self.getNodeTypes().then(function(nodeTypes){
      return _.findWhere(nodeTypes, {_id: id});
    });
  };

  self.getById = self.getNodeTypeById;

  return self;
});

