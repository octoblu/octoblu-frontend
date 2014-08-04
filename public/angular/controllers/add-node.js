'use strict';
angular.module('octobluApp')
    .controller('addNodeController', function($scope, $state, NodeTypeService) {
        NodeTypeService.getNodeTypes().then(function(nodeTypes){
            $scope.nodeTypes = nodeTypes;
        });

        $scope.nextStepUrl = function(nodeType){
            var sref = 'ob.nodewizard.add'+nodeType.category;
            return $state.href(sref, {nodeTypeId: nodeType._id});
        };
    });
