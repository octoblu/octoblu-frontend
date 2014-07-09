angular.module('octobluApp')
    .controller('CustomChannelController',function($scope, $state, customChannels ) {
        $scope.customChannels = customChannels;
    });
