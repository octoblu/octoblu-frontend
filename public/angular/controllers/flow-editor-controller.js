angular.module('octobluApp')
.controller('FlowEditorController', function($scope){
  'use strict';

  $scope.addNode = function(obj){
    $scope.flow.nodes.push(obj);
  };
});