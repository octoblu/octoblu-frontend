angular.module('octobluApp')
    .controller('CustomChannelController',function($scope, customChannels ) {
        $scope.customChannels = customChannels;
    });
