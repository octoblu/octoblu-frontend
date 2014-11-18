angular.module('octobluApp')
.service('TemplateService', function ($http) {
  'use strict';
  var self;
  self = this;

  self.createTemplate = function(template) {
    return $http.post("/api/templates", template);
  };

  self.withFlowId = function(flowId) {
    return $http.get('/api/flows/' + flowId + '/templates').then(function(response) {
      return response.data;
    });
  };

  self.getTemplate = function(id) {
    return $http.get('/api/templates/' + id).then(function(response){
      return response.data;
    });
  };

  self.importTemplate = function(id) {
    return $http.post('/api/templates/' + id + '/flows').then(function(response) {
      return response.data;
    })
  }

  self.deleteTemplate = function(id) {
    return $http.delete('/api/templates/' + id);
  };
});
