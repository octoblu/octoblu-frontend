'use strict';

angular.module('octobluApp')
    .controller('addSubdeviceController', function($scope, $stateParams, NodeTypeService, deviceService) {
        $scope.newSubDevice = {};

        NodeTypeService.getNodeTypes().then(function(nodeTypes){
            $scope.nodeType = _.findWhere(nodeTypes, {_id: $stateParams.nodeTypeId});
            return deviceService.getGateways()
        }).then(function(gateways){
            $scope.availableGateways = _.where(gateways, {online: true});
        });
    });
