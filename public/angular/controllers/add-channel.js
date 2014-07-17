'use strict';

angular.module('octobluApp')
    .controller('addChannelController', function($scope, $stateParams, currentUser, NodeTypeService, channelService) {
        $scope.newChannel = {};

        NodeTypeService.getNodeTypes().then(function(nodeTypes){
            $scope.newChannel.nodeType = _.findWhere(nodeTypes, {_id: $stateParams.nodeTypeId});

            console.log(currentUser);
            $scope.newChannel.existingApi = _.findWhere(currentUser.api, {name: $scope.newChannel.nodeType.name});
        });

    });
