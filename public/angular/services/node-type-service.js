angular.module('octobluApp')
.service('NodeTypeService', function (OCTOBLU_API_URL, $http, $q, OCTOBLU_ICON_URL) {
  'use strict';

  var self = this;

  self.getNodeTypes = function(){
    return $http.get(OCTOBLU_API_URL + '/api/node_types', {cache:true}).then(function(res){
      var nodeTypes = _.filter(res.data, function(data){
        return data.enabled;
      });

      return _.map(nodeTypes, self.addLogo);
    });
  };

  self.addLogo = function(node){
    var nodeCopy = _.clone(node);
    nodeCopy.logo = OCTOBLU_ICON_URL + nodeCopy.type.replace(':', '/') + '.svg';
    return nodeCopy;
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
