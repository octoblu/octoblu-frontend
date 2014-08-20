angular.module('octobluApp')
.controller('FlowChannelFormController', function($scope) {
  'use strict';

  $scope.getEndpointLabel = function(resource) {
    return resource.httpMethod + ' ' + resource.path;
  }

  var selectEndpoint = function(){
    var node, resources, selectedEndpoint;

    node = $scope.node;
    resources = node.application.resources;

    selectedEndpoint = _.findWhere(resources, {path: node.path, httpMethod: node.method});

    $scope.selectedEndpoint = selectedEndpoint || _.first(resources);
  };

  var transformParams = function(oldParams){
    var paramNames = _.pluck(oldParams, 'name');
    var newParams = {};
    _.each(paramNames, function(paramName){
      newParams[paramName] = '';
    });
    return _.defaults(_.pick($scope.node.params, paramNames), newParams);
  };

  $scope.$watch('selectedEndpoint', function(){
    if(!$scope.selectedEndpoint){
      return;
    }
    $scope.node.path   = $scope.selectedEndpoint.path;
    $scope.node.method = $scope.selectedEndpoint.httpMethod;
    $scope.node.params = transformParams($scope.selectedEndpoint.params);
  });

  $scope.$watch('node.path',   selectEndpoint);
  $scope.$watch('node.method', selectEndpoint);
});
