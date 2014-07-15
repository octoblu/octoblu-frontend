'use strict';

angular.module('octobluApp')
    .controller('addDeviceController', function($scope, $stateParams, NodeTypeService) {
        NodeTypeService.getNodeTypes().then(function(nodeTypes){
            $scope.nodeType = _.findWhere(nodeTypes, {_id: $stateParams.deviceId});
        });
    });
