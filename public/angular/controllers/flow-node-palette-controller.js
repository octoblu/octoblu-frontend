angular.module('octobluApp')
.controller('FlowNodePaletteController', function(OCTOBLU_API_URL, $scope) {
    'use strict';

    $scope.$watch('flowNodeTypes', function(newFlowNodeTypes){
      $scope.typesByCategory = _.groupBy(newFlowNodeTypes, 'category');
    });
});
