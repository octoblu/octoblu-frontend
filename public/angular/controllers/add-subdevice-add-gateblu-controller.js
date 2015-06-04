'use strict';

angular.module('octobluApp')
    .controller('AddSubdeviceAddGatebluController', function(OCTOBLU_API_URL, $scope, $state, $stateParams, NodeTypeService, skynetService, deviceService, AuthService) {
        $scope.newDevice = {};

        NodeTypeService.getNodeTypeByType('device:gateblu').then(function(nodeType){
          $scope.nodeType = nodeType;
        });

        deviceService.getUnclaimed('device:gateblu').then(function(unclaimedDevices){
          _.each(unclaimedDevices, function(device){
            device.label = device.uuid + ' (device:gateblu)';
          });

          $scope.newDevice.unclaimedDevices = unclaimedDevices;
          $scope.newDevice.unclaimedDevices.unshift({type: 'existing', label: 'Claim Existing'});
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
          AuthService.getCurrentUser().then(function(currentUser){
            if($scope.newDevice.selectedDevice) {
              if ($scope.newDevice.selectedDevice.type === 'existing') {
                deviceOptions.uuid = $scope.existingDevice.uuid;
                deviceOptions.token = $scope.existingDevice.token;
                deviceOptions.owner = currentUser.skynet.uuid;
                deviceOptions.isChanged = true;
                promise = deviceService.claimDevice(deviceOptions);
              } else {
                deviceOptions.uuid = $scope.newDevice.selectedDevice.uuid;
                promise = deviceService.claimDevice(deviceOptions);
              }
            } else {
              promise = deviceService.registerDevice(deviceOptions);
            }

            promise.then(function(device){
              $state.go("material.nodewizard.addsubdevice.form", {gatebluId: device.uuid});
            }, function(error){
              $scope.errorMessage = error;
            });
          });
        };
    });
