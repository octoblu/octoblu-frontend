angular.module('octobluApp')
.service('NodeService', function ($http) {
  'use strict';

  var self = this;

  self.getNodes = function() {
    return $http.get('/api/nodes').then(function(results){
      return results.data;
    });
  };

  return self;
});
