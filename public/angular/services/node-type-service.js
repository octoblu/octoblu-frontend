'use strict';
angular.module('octobluApp')
.service('NodeTypeService', function ($http, $q) {
  'use strict';
  var self = this;

  self.getNodeTypes = function(){
    return $http.get('/api/node_types', {cache:true}).then(function(res){
      var nodeTypes = _.filter(res.data, function(data){
        return data.enabled;
      });

      return _.map(nodeTypes, function(data){
        data.logo = 'https://s3-us-west-2.amazonaws.com/octoblu-icons/' + data.type.replace(':', '/') + '.svg';
        return data;
      });
    });
  };

  self.getNodeTypeById = function(id){
    return self.getNodeTypes().then(function(nodeTypes){
      return _.findWhere(nodeTypes, {_id: id});
    });
  };

  self.getNodeTypeByType = function(type){
    return self.getNodeTypes().then(function(nodeTypes){
      return _.findWhere(nodeTypes, {type: type});
    });
  };

  self.getById = self.getNodeTypeById;

  return self;
});

