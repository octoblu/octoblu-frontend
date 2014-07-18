'use strict';
angular.module('octobluApp')
    .controller('NodeController', function ($scope, $state, NodeService) {

        NodeService.getAllNodes().then(function(nodes){
            $scope.nodes = nodes;
        });

        $scope.nextStepUrl = function(node){
            var sref = 'ob.connector.nodes.'+ node.nodeType.category + '-detail';
            var params = {};
            if(node.nodeType.category === 'device'){
                params.uuid = node.uuid;
            } else if(node.nodeType.category === 'channel'){
               params.channelId = node._id;
            }
            return $state.href(sref, params);
        };

        $scope.isAvailable = function(node){
           if(node.category === 'device'){
               return node.online;
           }
           return true;
        };

    });
