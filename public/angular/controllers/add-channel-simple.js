'use strict';

angular.module('octobluApp')
    .controller('addChannelSimpleController', function($scope, $state, currentUser, nodeType, userService) {
        $scope.activate = function(){
            userService.saveConnection(currentUser.skynet.uuid, nodeType.channel._id, undefined, undefined, {},
                function () {
                    $state.go('ob.connector.nodes.channel-detail', {id: nodeType.channel._id});
                });

        };
    });
