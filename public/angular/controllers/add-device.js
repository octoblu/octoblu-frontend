'use strict';

angular.module('octobluApp')
    .controller('addDeviceController', function($scope, $stateParams, channelService) {
        channelService.getDeviceTypes().then(function(nodeTypes){
            $scope.nodeType = _.findWhere(nodeTypes, {_id: $stateParams.deviceId});
        });
    });
