'use strict';

angular.module('octobluApp')
    .controller('addSubdeviceFormController', function($scope, $state, $stateParams, NodeTypeService, PluginService, deviceService, skynetService) {
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

        $scope.addSubDevice = function(){
            var errors = $scope.newSubdevice.schemaEditor.validate();
            if (errors.length) {
                return;
            }

            skynetService.createSubdevice({
                        uuid:    $scope.newSubdevice.gateway.uuid,
                        token:   $scope.newSubdevice.gateway.token,
                        type:    $scope.newSubdevice.subdevice.type,
                        name:    $scope.newSubdevice.name,
                        options: $scope.newSubdevice.schemaEditor.getValue()
                    }).then(function (response) {
                        return deviceService.getDevices(true);
                    }).then(function (){
                        $state.go('ob.connector.devices.all');
                    });
        };
    });
