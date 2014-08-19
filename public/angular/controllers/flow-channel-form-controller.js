angular.module('octobluApp')
.controller('FlowChannelFormController', function($scope) {
  'use strict';

  $scope.flowEditor.editorNode.params = {};

  $scope.endpoints = [];
  var updateEndpoints = function(){
    $scope.endpoints = _.map($scope.flowEditor.editorNode.application.resources, function(resource){
      return {
        label: resource.httpMethod + ' ' + resource.path,
        value: resource
      }
    });
  };

  var selectEndpoint = function(){
    var node = $scope.flowEditor.editorNode;
    $scope.selectedEndpoint = _.find($scope.endpoints, function(endpoint){
      return endpoint.value.path === node.path && endpoint.value.httpMethod === node.method;
    });
    // throw new Error(JSON.stringify($scope.endpoints));

    $scope.selectedEndpoint = $scope.selectedEndpoint || _.first($scope.endpoints);
  };

  $scope.$watch('selectedEndpoint', function(){
    $scope.flowEditor.editorNode.path   = $scope.selectedEndpoint.value.path;
    $scope.flowEditor.editorNode.method = $scope.selectedEndpoint.value.httpMethod;
  }, true);

  $scope.$watch('flowEditor.editorNode.application.resources', updateEndpoints, true);
  updateEndpoints();
  $scope.$watch('flowEditor.editorNode', selectEndpoint, true);
  selectEndpoint();
});
