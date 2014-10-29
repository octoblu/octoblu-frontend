'use strict';

angular.module('octobluApp')
	.controller('addChannelExistingController', function($scope, $state, nodeType, channelService) {
		channelService.getChannelActivationById(nodeType.channelid)
			.then(function(channelActivation){
		    $scope.existingChannel = channelActivation;
		  });
	});
