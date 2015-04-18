'use strict';

angular.module('octobluApp')
.controller('addChannelController', function(OCTOBLU_API_URL, $scope, nodeType) {
  $scope.nodeType = nodeType;
});
