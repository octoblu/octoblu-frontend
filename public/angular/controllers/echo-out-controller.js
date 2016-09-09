angular.module('octobluApp')
.controller('EchoOutController', function($scope) {
  $scope.clearResponse = function() {
    if($scope.enable == true){
      $scope.response = null
    }
  };
});
