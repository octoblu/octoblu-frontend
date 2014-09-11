angular.module('octobluApp')
.controller('ParamInputController', function($scope) {
  'use strict';
  var copyParamsToNgModel, instantiateParams;

  $scope.ngModel = $scope.ngModel || {};

  instantiateParams = function(){
    if(!$scope.paramDefinitions) { return; }

    $scope.params = {};

    _.each($scope.paramDefinitions, function(paramDefinition){
      var existingValue = $scope.ngModel[paramDefinition.name];
      $scope.params[paramDefinition.name] = existingValue || paramDefinition.default || '';
    });
  };

  copyParamsToNgModel = function(){
    if(!$scope.params) { return; }

    $scope.ngModel = _.pick($scope.params, function(value){
      return value !== '';
    });

    // console.log('params changed', JSON.stringify($scope.params));
    // console.log('ngModel changed', JSON.stringify($scope.ngModel));
  };

  $scope.$watch('paramDefinitions', instantiateParams);
  $scope.$watch('params', copyParamsToNgModel, true);
});
