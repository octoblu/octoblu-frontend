angular.module('octobluApp')
.controller('FlowNodeSetupController', function($scope) {
  'use strict';

  $scope.close = function(){
    $scope.nodeType = null;
  };
});
