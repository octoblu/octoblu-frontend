angular.module('octobluApp')
.service('BluprintService', function ($http, OCTOBLU_API_URL, UrlService) {
  'use strict';
  var self;
  self = this;
  var operators = ["broadcast","debug","equal","http-post-request","less-than","pluck","set-key",
  "change",
  "delay",
  "function",
  "http-put-request",
  "math",
  "range",
  "template",
  "collect",
  "demultiplex",
  "get-key",
  "http-request",
  "microblu",
  "rss",
  "throttle",
  "comment",
  "device",
  "greater-than-equal",
  "interval",
  "not-equal",
  "sample",
  "trigger",
  "compose",
  "echo-in",
  "greater-than",
  "leading-edge-debounce",
  "null",
  "schedule",
  "unique",
  "debounce",
  "echo-out",
  "http-delete-request",
  "less-than-equal",
  "on-start",
  "sentiment"]

  self.createBluprint = function(bluprint) {
    return $http.post(OCTOBLU_API_URL + "/api/templates", bluprint).then(function(response) {
      return response.data;
    });
  };

  self.update = function(uuid, data) {
    var bluprint = _.omit(data, ['_id', 'uuid', 'flow']);
    return $http.put(OCTOBLU_API_URL + '/api/templates/' + uuid, bluprint).then(function(response){
      return response.data;
    });
  };

  self.withFlowId = function(flowId) {
    return $http.get(OCTOBLU_API_URL + '/api/flows/' + flowId + '/templates').then(function(response) {
      return self.addPropertiesToList(response.data);
    });
  };

  self.findOne = function(flowId) {
    return $http.get(OCTOBLU_API_URL + '/api/templates/' + flowId).then(function(response) {
      return self.addProperties(response.data);
    });
  };

  self.getPublicBluprints = function(tags) {
    return $http.get(OCTOBLU_API_URL + '/api/templates/public', {params: {tags: tags}}).then(function(response){
      return self.addPropertiesToList(response.data);
    });
  };

  self.getPublicBluprintsPaged = function(tags, limit, page) {
    return $http.get(OCTOBLU_API_URL + '/api/templates/public', {params: {tags: tags, pageLimit: limit, pageNumber: page}}).then(function(response){
      return self.addPropertiesToList(response.data);
    });
  };

  self.getRecentPublic = function(tags, limit) {
    return $http.get(OCTOBLU_API_URL + '/api/templates/public/recent', {params: {tags: tags, limit: limit}}).then(function(response){
      return self.addPropertiesToList(response.data);
    });
  };

  self.getPublicBluprintsNameFilter = function(tags, name) {
    return $http.get(OCTOBLU_API_URL + '/api/templates/public', {params: {tags: tags, nameFilter: name}}).then(function(response){
      return self.addPropertiesToList(response.data);
    });
  };

  self.getAllBluprints = function() {
    return $http.get(OCTOBLU_API_URL + '/api/templates').then(function(response) {
      return self.addPropertiesToList(response.data);
    });
  };

  self.getBluprint = function(id) {
    return $http.get(OCTOBLU_API_URL + '/api/templates/' + id).then(function(response){
      if(!response.data) {
        throw new Error("No Bluprint Found")
      };
      return self.addProperties(response.data);
    });
  };

  self.importBluprint = function(id) {
    return $http.post(OCTOBLU_API_URL + '/api/templates/' + id + '/flows').then(function(response) {
      return response.data;
    })
  };

  self.addPropertiesToList = function(bluprints) {
    return _.map(bluprints, self.addProperties);
  };

  self.addProperties = function(bluprint) {
    bluprint = _.clone(bluprint);
    bluprint.tags = _.uniq(bluprint.tags) || [];
    return bluprint;
  };

  self.deleteBluprint = function(id) {
    return $http.delete(OCTOBLU_API_URL + '/api/templates/' + id);
  };
});
