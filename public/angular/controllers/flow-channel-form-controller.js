angular.module('octobluApp')
.controller('FlowChannelFormController', function($scope, channelService) {
  'use strict';

  var getResources = function(){
    channelService.getById($scope.node.channelid).then(function(channel){
      $scope.resources = channel.application.resources;
    });
  }

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

  var transformParams = function(paramsArray, existingParams){
    var paramNames = _.pluck(paramsArray, 'name');
    var params = {};
    _.each(paramNames, function(paramName){
      params[paramName] = '';
    });
    return _.defaults(_.pick(existingParams, paramNames), params);
  };

  $scope.$watch('selectedEndpoint', function(){
    if(!$scope.selectedEndpoint){
      return;
    }
    $scope.node.path   = $scope.selectedEndpoint.path;
    $scope.node.method = $scope.selectedEndpoint.httpMethod;
    $scope.node.queryParams = transformParams(_.where($scope.selectedEndpoint.params, {style: 'query'}), $scope.node.queryParams);
    $scope.node.bodyParams  = transformParams(_.where($scope.selectedEndpoint.params, {style: 'body'}),  $scope.node.bodyParams);
    $scope.node.urlParams   = transformParams(_.where($scope.selectedEndpoint.params, {style: 'url'}),   $scope.node.urlParams);
  });

  $scope.$watch('node',        getResources);
  $scope.$watch('node.path',   selectEndpoint);
  $scope.$watch('node.method', selectEndpoint);
  $scope.$watch('resources',   selectEndpoint);
});
