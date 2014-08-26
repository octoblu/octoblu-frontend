angular.module('octobluApp')
.controller('NodeController', function ($scope, $state, NodeService) {
    'use strict';

    NodeService.getNodes().then(function(nodes){
        console.log(nodes);
        $scope.nodes = nodes;
    });

    $scope.nextStepUrl = function (node) {
        var sref = 'ob.connector.nodes.' + node.category + '-detail';
        var params = {};
        if (node.category === 'device') {
            params.uuid = node.resource.uuid;
        } else if (node.category === 'channel') {
            params.id = node.channelid;
        }
        return $state.href(sref, params);
    };

    $scope.isAvailable = function (node) {
        if (node.category === 'device') {
            return node.resource.online;
        }
        return true;
    };

});
