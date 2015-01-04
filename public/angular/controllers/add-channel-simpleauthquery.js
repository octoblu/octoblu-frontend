angular.module('octobluApp')
.controller('addChannelSimpleAuthQueryController', function($scope, $state, nodeType, AuthService, userService) {
  'use strict';

  $scope.activate = function(){
    AuthService.getCurrentUser().then(function(user){
      userService.saveSimpleAuthQuery(nodeType.channelid, 
      	$scope.newChannel.userId,
  	 	$scope.newChannel.password,
  	    $scope.newChannel.domain, 
      	$scope.newChannel.appKey, 
       function(){
        $state.go('material.design');
      });
    });
  };
});