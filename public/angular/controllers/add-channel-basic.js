'use strict';

angular.module('octobluApp')
    .controller('addChannelBasicController', function($scope, $state, currentUser, nodeType, userService) {
        $scope.activate = function(){
            userService.saveConnection(currentUser.skynetuuid, nodeType.channel._id, 
            	$scope.newChannel.key, $scope.newChannel.token, {},
                function () {
                    $state.go('ob.connector.nodes.channel-detail', {id: nodeType.channel._id});
                });

        };
    });
