angular.module('octobluApp')
.controller('FlowChannelFormController', function($scope) {
  'use strict';

  $scope.flowEditor.editorNode.params = {};

  var updateEndpoints = function(){
    $scope.endpoints = _.map($scope.flowEditor.editorNode.application.resources, function(resource){
      return {
        label: resource.httpMethod + ' ' + resource.path,
        value: resource
      }
    });
  };

  $scope.$watch('selectedEndpoint', function(){
    $scope.flowEditor.editorNode.path   = $scope.selectedEndpoint.value.path;
    $scope.flowEditor.editorNode.method = $scope.selectedEndpoint.value.httpMethod;
  }, true);

  $scope.$watch('flowEditor.editorNode.application.resources', updateEndpoints, true);
  updateEndpoints();
  $scope.selectedEndpoint = _.first($scope.endpoints);
});
