angular.module('octobluApp')
.controller('ComposeController', function($scope) {
  if (!_.isArray($scope.data)) {
    $scope.data = _.pairs($scope.data);
  }

  $scope.addKeyValue = function() {
    $scope.data.push(['', '']);
  };

  $scope.deleteKeyValue = function(index) {
    _.pullAt($scope.data, index);
  };
});
