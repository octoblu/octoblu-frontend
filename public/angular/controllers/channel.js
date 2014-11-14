'use strict';
angular.module('octobluApp')
    .controller('ChannelController',function($scope, activeChannels,  availableChannels ) {
        $scope.activeChannels = activeChannels;
        $scope.availableChannels = availableChannels;
    });
