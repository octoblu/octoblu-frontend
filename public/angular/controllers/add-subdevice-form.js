'use strict';

angular.module('octobluApp')
    .controller('addSubdeviceFormController', function($scope, $stateParams, NodeTypeService, PluginService, deviceService) {
        $scope.newSubdevice = {
            schemaEditor: {},
            subdevice: { options: {}, type: null }
        };

        NodeTypeService.getNodeTypes().then(function(nodeTypes){
            var nodeType = _.findWhere(nodeTypes, {_id: $stateParams.deviceId});
            $scope.nodeType = nodeType;
            $scope.newSubdevice.subdevice.type = nodeType.skynet.plugin;
            return deviceService.getGateways();
        }).then(function(gateways){
            $scope.availableGateways = gateways;
            $scope.newSubdevice.gateway = _.findWhere(gateways, {uuid: $stateParams.gatewayId});
            return PluginService.getOrInstallPlugin($scope.newSubdevice.gateway, $scope.nodeType.skynet.plugin);
        }).then(function(plugin){
            $scope.newSubdevice.plugin = plugin;
        });
    });
