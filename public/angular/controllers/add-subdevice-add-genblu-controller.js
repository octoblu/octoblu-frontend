'use strict';

angular.module('octobluApp')
    .controller('AddSubdeviceAddGenbluController', function($scope, $state, $stateParams, NodeTypeService, skynetService, deviceService) {
        $scope.newDevice = {};

        NodeTypeService.getNodeTypeByType('device:genblu').then(function(nodeType){
          $scope.nodeType = nodeType;
        });

        deviceService.getUnclaimed('device:genblu').then(function(unclaimedDevices){
          $scope.newDevice.unclaimedDevices = unclaimedDevices;
          $scope.newDevice.selectedDevice   = _.first(unclaimedDevices);
        });

        $scope.addDevice = function() {
          var deviceOptions, promise;
          delete $scope.errorMessage;

          deviceOptions = {
            type:    $scope.nodeType.skynet.type,
            subtype: $scope.nodeType.skynet.subtype,
            name:    $scope.newDevice.name
          };

          if($scope.newDevice.selectedDevice) {
            deviceOptions.uuid = $scope.newDevice.selectedDevice.uuid;
            promise = deviceService.claimDevice(deviceOptions);
          } else {
            promise = deviceService.registerDevice(deviceOptions);
          }

          promise.then(function(device){
            $state.go("ob.nodewizard.addsubdevice.form", {gatewayId: device.uuid});
          }, function(error){
            $scope.errorMessage = error;
          });
        };
    });
