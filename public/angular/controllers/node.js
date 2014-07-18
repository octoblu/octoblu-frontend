'use strict';
angular.module('octobluApp')
    .controller('NodeController', function ($scope, $state, NodeService) {

        NodeService.getAllNodes().then(function(nodes){
            $scope.nodes = nodes;
        });

        $scope.$on('skynet:message', function(){
          NodeService.getAllNodes().then(function(nodes){
            $scope.nodes = nodes;
          });
        });

        $scope.nextStepUrl = function(node){
            var sref = 'ob.connector.nodes.'+ node.category + '-detail';
            var params = {};
            if(node.category === 'device'){
                params.uuid = node.uuid;
            } else if(node.category === 'channel'){
               params.id = node.nodeType.channel._id;
            }
            return $state.href(sref, params);
        };

        $scope.isAvailable = function(node){
           if(node.category === 'device'){
               return node.resource.online;
           }
           return true;
        };

    });
