angular.module('octobluApp')
.controller('ComposeController', function($scope) {
  if ($scope.composeValues && $scope.composeKeys) {
    $scope.data = _.zipObject($scope.composeKeys, $scope.composeValues);
    delete $scope.composeKeys;
    delete $scope.composeValues;
  }

  $scope.keyValues = _.pairs($scope.data);

  $scope.$watch('keyValues', function(keyValues) {
    if(!keyValues) {
      return;
    }

    updateComposeNode(keyValues);
  }, true);

  $scope.addKeyValue = function() {
    $scope.keyValues.push([]);
  };

  $scope.deleteKeyValue = function(keyValue) {
    $scope.keyValues = _.without($scope.keyValues, keyValue);
  };

  function updateComposeNode(keyValues) {
    var newComposeNode = {};

    _.each(keyValues, function(keyValue){
      var key = keyValue[0], value = keyValue[1];

      if(!key) {
        return;
      }
      newComposeNode[key] = value;
    });

    $scope.data = newComposeNode;
  }

});
