'use strict';

angular.module('octobluApp')
    .controller('addSubdeviceFormController', function($scope, $stateParams, NodeTypeService, PluginService, deviceService) {
        $scope.newSubDevice = {};

        NodeTypeService.getNodeTypes().then(function(nodeTypes){
            $scope.nodeType = _.findWhere(nodeTypes, {_id: $stateParams.deviceId});
            return deviceService.getGateways();
        }).then(function(gateways){
            $scope.availableGateways = gateways;
            $scope.newSubDevice.gateway = _.findWhere(gateways, {uuid: $stateParams.gatewayId});
            return PluginService.getOrInstallPlugin($scope.newSubDevice.gateway);
        }).then(function(plugin){
            $scope.newSubDevice.plugin = plugin;
        });
    });
