angular.module('octobluApp')
.service('TemplateService', function ($http) {
  'use strict';
  var self;
  self = this;

  self.createTemplate = function(template) {
    return $http.post(OCTOBLU_API_URL + "/api/templates", template).then(function(response) {
      return response.data;
    });
  };

  self.update = function(uuid, data) {
    var template = {
      name: data.name,
      flow: data.flow
    };
    return $http.put(OCTOBLU_API_URL + '/api/templates/' + uuid, template).then(function(response){
      return response.data;
    });
  };

  self.withFlowId = function(flowId) {
    return $http.get(OCTOBLU_API_URL + '/api/flows/' + flowId + '/templates').then(function(response) {
      return response.data;
    });
  };

  self.withUserUUID = function(uuid) {
    return $http.get(OCTOBLU_API_URL + '/api/users/' + uuid + '/templates').then(function(response) {
      return response.data;
    });
  };

  self.getAllTemplates = function() {
    return $http.get(OCTOBLU_API_URL + '/api/templates').then(function(response) {
      return response.data;
    });
  };
  
  self.getTemplate = function(id) {
    return $http.get(OCTOBLU_API_URL + '/api/templates/' + id).then(function(response){
      return response.data;
    });
  };

  self.importTemplate = function(id) {
    return $http.post(OCTOBLU_API_URL + '/api/templates/' + id + '/flows').then(function(response) {
      return response.data;
    })
  }

  self.deleteTemplate = function(id) {
    return $http.delete(OCTOBLU_API_URL + '/api/templates/' + id);
  };
});
