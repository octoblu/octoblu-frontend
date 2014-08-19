angular.module('octobluApp')
.controller('FlowChannelFormController', function($scope) {
  'use strict';

  $scope.node.params = {};

  $scope.endpoints = [];
  var updateEndpoints = function(){
    if (_.isUndefined($scope.node.application)){
      return;
    }
    $scope.endpoints = _.map($scope.node.application.resources, function(resource){
      return {
        label: resource.httpMethod + ' ' + resource.path,
        value: resource
      }
    });
  };

  var selectEndpoint = function(){
    var node = $scope.node;
    $scope.selectedEndpoint = _.find($scope.endpoints, function(endpoint){
      return endpoint.value.path === node.path && endpoint.value.httpMethod === node.method;
    });

    $scope.selectedEndpoint = $scope.selectedEndpoint || _.first($scope.endpoints);
  };

  $scope.$watch('selectedEndpoint', function(){
    $scope.node.path   = $scope.selectedEndpoint.value.path;
    $scope.node.method = $scope.selectedEndpoint.value.httpMethod;
  }, true);

  $scope.$watch('node.application.resources', updateEndpoints, true);
  updateEndpoints();
  $scope.$watch('node', selectEndpoint, true);
  selectEndpoint();
});
