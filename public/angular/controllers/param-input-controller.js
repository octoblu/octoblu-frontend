angular.module('octobluApp')
.controller('ParamInputController', function($scope) {
  'use strict';

  $scope.$watch('paramDefinitions', function(){
    $scope.params = {};

    _.each($scope.paramDefinitions, function(paramDefinition){
      $scope.params[paramDefinition.name] = paramDefinition.default || '';
    });
  });

  $scope.$watch('params', function(){
    $scope.ngModel = _.pick($scope.params, function(value){
      return value !== '';
    });
  });
});
