angular.module('octobluApp')
<<<<<<< HEAD
    .controller('addSubdeviceFormController', function($scope, $state, $stateParams, NodeTypeService, PluginService, deviceService) {
        $scope.newSubdevice = {
            schemaEditor: {},
            subdevice: { options: {}, type: null }
        };

        NodeTypeService.getNodeTypes().then(function(nodeTypes){
            var nodeType = _.findWhere(nodeTypes, {_id: $stateParams.nodeTypeId});
            $scope.nodeType = nodeType;
            $scope.newSubdevice.subdevice.type = nodeType.skynet.plugin;
            return deviceService.getDeviceByUUID($stateParams.gatewayId);
        }).then(function(gateway){
            $scope.newSubdevice.gateway = gateway;
            return deviceService.gatewayConfig({
                "uuid": gateway.uuid,
                "token": gateway.token,
                "method": "configurationDetails"
            }).then(function (response) {
                if (response && response.result) {
                    gateway.subdevices = response.result.subdevices || [];
                }
                return PluginService.getOrInstallPlugin($scope.newSubdevice.gateway, $scope.nodeType.skynet.plugin);
            });

        }).then(function(plugin){
            $scope.newSubdevice.plugin = plugin;
        });

        $scope.addSubDevice = function(){
            var errors, duplicateDevice;
            errors = $scope.newSubdevice.schemaEditor.validate();
            if (errors && errors.length) {
                return;
            }

            duplicateDevice = _.findWhere($scope.newSubdevice.gateway.subdevices, {name: $scope.newSubdevice.name});
            if (duplicateDevice) {
                return;
            }

            deviceService.createSubdevice({
                        uuid:    $scope.newSubdevice.gateway.uuid,
                        token:   $scope.newSubdevice.gateway.token,
                        type:    $scope.newSubdevice.subdevice.type,
                        name:    $scope.newSubdevice.name,
                        options: $scope.newSubdevice.schemaEditor.getValue()
                    }).then(function (response) {
                        return deviceService.getDevices(true);
                    }).then(function (){
                        $state.go('ob.connector.nodes.all');
                    });
        };
=======
.controller('addSubdeviceFormController', function($scope, $state, $stateParams, GatebluService, deviceService, NodeTypeService) {
'use strict';

  NodeTypeService.getNodeTypeById($stateParams.nodeTypeId).then(function(nodeType){
    $scope.nodeType = nodeType;
  }).then(function(){
    return GatebluService.addDevice($stateParams.gatebluId, $scope.nodeType)
  }).then(function(device){
    $scope.device = device;
  });

  $scope.submit = function(){
    deviceService.updateDevice($scope.device).then(function(){
      $state.go('ob.connector.nodes.device-detail', {uuid: $scope.device.uuid}, {replace: true});
>>>>>>> FETCH_HEAD
    });
  };
});
