angular.module('octobluApp')
    .controller('CustomChannelController',function($scope, $state, $log, customChannels ) {
        $scope.customChannels = customChannels;
        $scope.updateCustomChannel = function(channel) {
        	$log.info('update...');
        	for(var l = 0; l<$scope.customChannels.length; l++) {
        		if($scope.customChannels[l].name===channel.name) {
        			$scope.customChannels[l] = channel;
        			return;
        		}
        	}
        	$scope.customChannels.push(channel);
        };
        $scope.removeCustomChannels = function(channel) {
        	$log.info('remove...');
        	for(var l = 0; l<$scope.customChannels.length; l++) {
        		if($scope.customChannels[l].name===channel.name) {
        			 myArray.splice(l, 1);
        			return;
        		}
        	}
        };
    });
