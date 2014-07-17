'use strict';

angular.module('octobluApp')
    .controller('addDeviceController', function($scope, $state, $stateParams, NodeTypeService, skynetService, deviceService) {
        $scope.newDevice = {};

        NodeTypeService.getNodeTypes().then(function(nodeTypes){
            $scope.nodeType = _.findWhere(nodeTypes, {_id: $stateParams.nodeTypeId});
        })
        .then(function(){
            return deviceService.getUnclaimed($scope.nodeType.category);
        })
        .then(function(unclaimedDevices){
            $scope.newDevice.unclaimedDevices = unclaimedDevices;
            $scope.newDevice.selectedDevice   = _.first(unclaimedDevices);
        });

        $scope.addDevice = function() {
          var deviceOptions, promise;
          delete $scope.errorMessage;

          deviceOptions = {
            type: $scope.nodeType.skynet.type,
            subtype: $scope.nodeType.skynet.subtype,
            name: $scope.newDevice.name
          };

          if($scope.newDevice.selectedDevice) {
            deviceOptions.uuid = $scope.newDevice.selectedDevice.uuid;
            promise = skynetService.claimAndUpdateDevice(deviceOptions);
          } else {
            promise = skynetService.registerDevice(deviceOptions);
          }

          promise.then(function(){
            $state.go("ob.connector.devices.all");
          }, function(error){
            $scope.errorMessage = error;
          });
        };
    });
