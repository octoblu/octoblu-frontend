angular.module('octobluApp')
.controller('FlowEditorController', function(OCTOBLU_API_URL, $scope, FlowNodeDimensions){
  'use strict';

  $scope.addNode = function(data, event){
    var flowNodeType = data['json/flow-node-type'];
    var newLoc = $scope.snap.transformCoords(event.clientX,event.clientY);
    flowNodeType.x = newLoc.x - (FlowNodeDimensions.width / 2);
    flowNodeType.y = newLoc.y - (FlowNodeDimensions.minHeight / 2);
    $scope.$emit('flow-node-type-selected', flowNodeType);
  };
});
