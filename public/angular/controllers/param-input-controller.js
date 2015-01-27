angular.module('octobluApp')
  .controller('ParamInputController', function($scope) {
    'use strict';
    var copyParamsToNgModel, instantiateParams;

    $scope.ngModel = $scope.ngModel || {};
    var defaultSchema = {
      type: "object",
      properties: {}
    };

    function getSchema(name) {
      return _.extend({
        title: name
      }, defaultSchema);
    }

    function getArraySchema(name) {
      return {
        title: name,
        type: "array",
        format: "table",
        items: {
          type: "string"
        }
      }
    }

    instantiateParams = function() {
      if (!$scope.paramDefinitions) {
        return;
      }

      $scope.params = {};

      _.each($scope.paramDefinitions, function(paramDefinition) {
        var existingValue = $scope.ngModel[paramDefinition.name];
        var paramDefault = '';
        if(paramDefinition.type === 'object') {
            paramDefinition.schema = getSchema(paramDefinition.name);
            paramDefault = {};
        }
        if(paramDefinition.type === 'array') {
          paramDefinition.schema = getArraySchema(paramDefinition.displayName);
          paramDefault = [];
        }
        $scope.params[paramDefinition.name] = existingValue || paramDefinition.default || paramDefault;
      });
    };

    copyParamsToNgModel = function() {
      if (!$scope.params) {
        return;
      }

      $scope.ngModel = _.pick($scope.params, function(value) {
        return value !== '';
      });
    };

    $scope.inputType = function(type) {
      if (type === 'boolean') {
        return 'checkbox';
      }
      if (type === 'number') {
        return 'number';
      }
      return 'text';
    };

    $scope.$watch('paramDefinitions', instantiateParams);
    $scope.$watch('params', copyParamsToNgModel, true);
  });