'use strict';
angular.module('octobluApp')
    .controller('NodeController', function ($scope, $state, NodeService) {

        NodeService.getAllNodes().then(function (nodes) {
            $scope.nodes = nodes;
        });

        NodeService.getSharedNodes().then(function (nodes) {
            $scope.sharedNodes = nodes;
        });

        $scope.$on('skynet:message', function () {
            NodeService.getAllNodes().then(function (nodes) {
                $scope.nodes = nodes;
            });
            NodeService.getSharedNodes().then(function (nodes) {
                $scope.sharedNodes = nodes;
            });
        });

        $scope.nextStepUrl = function (node) {
            var sref = 'ob.connector.nodes.' + node.category + '-detail';
            var params = {};
            if (node.category === 'device') {
                params.uuid = node.resource.uuid;
            } else if (node.category === 'channel') {
                params.id = node.nodeType.channel._id;
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
