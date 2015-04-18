'use strict';
angular.module('octobluApp')
    .controller('ChannelController',function(OCTOBLU_API_URL, $scope, activeChannels,  availableChannels ) {
        $scope.activeChannels = activeChannels;
        $scope.availableChannels = availableChannels;
    });
