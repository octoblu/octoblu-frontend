angular.module('octobluApp')
.controller('FlowNodeSetupController', function(OCTOBLU_API_URL, $scope) {
  'use strict';

  $scope.close = function(){
    $scope.nodeType = null;
  };
});
