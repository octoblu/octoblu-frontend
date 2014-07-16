'use strict';

angular.module('octobluApp')
    .controller('addSubdeviceFormController', function($scope, $stateParams, NodeTypeService, PluginService, deviceService) {
        $scope.newSubdevice = {};

        NodeTypeService.getNodeTypes().then(function(nodeTypes){
            $scope.nodeType = _.findWhere(nodeTypes, {_id: $stateParams.deviceId});
            return deviceService.getGateways();
        }).then(function(gateways){
            $scope.availableGateways = gateways;
            $scope.newSubdevice.gateway = _.findWhere(gateways, {uuid: $stateParams.gatewayId});
            return PluginService.getOrInstallPlugin($scope.newSubdevice.gateway);
        }).then(function(plugin){
            console.log('Found plugin', plugin);
            $scope.newSubdevice.plugin = plugin;
            console.log('Ready to render:', $scope.newSubdevice);
        });
    });
