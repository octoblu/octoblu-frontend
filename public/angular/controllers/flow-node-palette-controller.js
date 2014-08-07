angular.module('octobluApp')
.controller('FlowNodePaletteController', function($scope) {
    'use strict';

    $scope.$watch('flowNodeTypes', function(newFlowNodeTypes){
      $scope.typesByCategory = _.groupBy(newFlowNodeTypes, 'category');
    });
});
