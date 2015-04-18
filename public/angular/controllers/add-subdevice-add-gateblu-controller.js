'use strict';

angular.module('octobluApp')
    .controller('AddSubdeviceAddGatebluController', function(OCTOBLU_API_URL, $scope, $state, $stateParams, NodeTypeService, skynetService, deviceService) {
        $scope.newDevice = {};

        NodeTypeService.getNodeTypeByType('device:gateblu').then(function(nodeType){
          $scope.nodeType = nodeType;
        });

        deviceService.getUnclaimed('device:gateblu').then(function(unclaimedDevices){
          _.each(unclaimedDevices, function(device){
            device.label = device.uuid + ' (device:gateblu)';
          });

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
            $state.go("material.nodewizard.addsubdevice.form", {gatebluId: device.uuid});
          }, function(error){
            $scope.errorMessage = error;
          });
        };
    });
