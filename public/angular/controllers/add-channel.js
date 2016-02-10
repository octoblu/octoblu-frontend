'use strict';

angular.module('octobluApp')
.controller('addChannelController', function(OCTOBLU_API_URL, $scope, nodeType) {
  $scope.nodeType = nodeType;
  $scope.fragments = [{linkTo: 'material.things', label: 'All Things'}, {label: "Add " + nodeType.name}]
});
