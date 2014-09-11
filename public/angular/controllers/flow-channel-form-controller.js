angular.module('octobluApp')
.controller('FlowChannelFormController', function($scope, channelService) {
  'use strict';

  channelService.getById($scope.node.channelid).then(function(channel){
    $scope.resources = channel.application.resources;
  });

  $scope.getEndpointLabel = function(resource) {
    return resource.httpMethod + ' ' + resource.path;
  }

  var selectEndpoint = function(){
    var node, resources, selectedEndpoint;

    node = $scope.node;
    resources = $scope.resources
    selectedEndpoint = _.findWhere(resources, {path: node.path, httpMethod: node.method});
    $scope.selectedEndpoint = selectedEndpoint || _.first(resources);
  };

  var updateNodeWithSelectedEndpoint = function(){
    if(!$scope.selectedEndpoint){
      return;
    }
    $scope.node.path   = $scope.selectedEndpoint.path;
    $scope.node.method = $scope.selectedEndpoint.httpMethod;

    $scope.queryParamDefinitions = _.where($scope.selectedEndpoint.params, {style: 'query'});
    $scope.bodyParamDefinitions  = _.where($scope.selectedEndpoint.params, {style: 'body'})
    $scope.urlParamDefinitions   = _.where($scope.selectedEndpoint.params, {style: 'url'})
  };

  $scope.$watch('resources',   selectEndpoint);
  $scope.$watch('selectedEndpoint', updateNodeWithSelectedEndpoint);
});
