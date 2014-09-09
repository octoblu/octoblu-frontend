angular.module('octobluApp')
.controller('FlowChannelFormController', function($scope, channelService) {
  'use strict';

  var getResources = function(){
    if(!$scope.node.channelid){
      return $scope.resources = null;
    }

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

    $scope.queryParamDefinitions = _.where($scope.selectedEndpoint.params, {style: 'query'});
    $scope.bodyParamDefinitions  = _.where($scope.selectedEndpoint.params, {style: 'body'})
    $scope.urlParamDefinitions   = _.where($scope.selectedEndpoint.params, {style: 'url'})

    $scope.node.queryParams      = transformParams($scope.queryParamDefinitions, $scope.node.queryParams);
    $scope.node.bodyParams       = transformParams($scope.bodyParamDefinitions,  $scope.node.bodyParams);
    $scope.node.urlParams        = transformParams($scope.urlParamDefinitions,   $scope.node.urlParams);
  });

  $scope.$watch('node.queryParams', function(){
    $scope.node.queryParams = _.pick($scope.node.queryParams, function(value){
      return value !== '';
    });
  }, true);

  $scope.$watch('node.bodyParams', function(){
    $scope.node.bodyParams = _.pick($scope.node.bodyParams, function(value){
      return value !== '';
    });
  }, true);

  $scope.$watch('node.urlParams', function(){
    $scope.node.urlParams = _.pick($scope.node.urlParams, function(value){
      return value !== '';
    });
  }, true);

  $scope.$watch('node',        getResources);
  $scope.$watch('node.path',   selectEndpoint);
  $scope.$watch('node.method', selectEndpoint);
  $scope.$watch('resources',   selectEndpoint);
});
