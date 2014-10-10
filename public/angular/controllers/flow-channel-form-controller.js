angular.module('octobluApp')
.controller('FlowChannelFormController', function($scope, channelService) {
  'use strict';

  channelService.getById($scope.node.channelid).then(function(channel){
    var resources = _.filter(channel.application.resources, function(resource){
      if(resource.enabled === false){
        return false;
      }
      return true;
    });
    resources.sort(function(a, b){
      if(a.path < b.path){
        return -1;
      }
      if(a.path > b.path){
        return 1;
      }
      return 0;
    });
    $scope.resources = resources;
  });

  $scope.getEndpointLabel = function(resource) {
    return resource.httpMethod + ' ' + resource.path;
  };

  var selectEndpoint = function(){
    var node, resources, selectedEndpoint;

    node = $scope.node;
    resources = $scope.resources;
    selectedEndpoint = _.findWhere(resources, {url: node.url, httpMethod: node.method});
    $scope.selectedEndpoint = selectedEndpoint || _.first(resources);
  };

  var filterParamsByStyle = function(params, style){
    return _.where(params, {style: style});
  };

  var updateNodeWithSelectedEndpoint = function(){
    if(!$scope.selectedEndpoint){
      return;
    }
    $scope.node.url    = $scope.selectedEndpoint.url;
    $scope.node.method = $scope.selectedEndpoint.httpMethod;

    $scope.queryParamDefinitions = filterParamsByStyle($scope.selectedEndpoint.params, 'query');
    $scope.bodyParamDefinitions  = filterParamsByStyle($scope.selectedEndpoint.params, 'body');
    $scope.urlParamDefinitions   = filterParamsByStyle($scope.selectedEndpoint.params, 'url');
  };

  $scope.$watch('resources',   selectEndpoint);
  $scope.$watch('selectedEndpoint', updateNodeWithSelectedEndpoint);
});
