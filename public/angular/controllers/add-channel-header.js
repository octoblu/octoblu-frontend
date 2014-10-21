'use strict';

angular.module('octobluApp')
    .controller('addChannelHeaderController', function($scope, $state, currentUser, nodeType, userService) {
        $scope.activate = function(){
            userService.saveConnection(currentUser.skynetuuid, nodeType.channelid, $scope.newChannel.apiKey, undefined, {},
                function () {
                    $state.go('ob.connector.nodes.channel-detail', {id: nodeType.channelid});
                });

        };
    });
