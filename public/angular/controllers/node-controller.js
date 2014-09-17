angular.module('octobluApp')
.controller('NodeController', function ($scope, $state, NodeService) {
    'use strict';

    NodeService.getNodes().then(function(nodes){
        $scope.nodes = nodes;
    });

    $scope.nextStepUrl = function (node) {
        var sref = 'ob.connector.nodes.' + node.category + '-detail';
        var params = {};
        if (node.category === 'device') {
            params.uuid = node.uuid;
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

    $scope.logoUrl = function(nodeType) {
        return 'https://s3-us-west-2.amazonaws.com/octoblu-icons/' + nodeType.type.replace(':', '/') + '.svg';
    }
});
