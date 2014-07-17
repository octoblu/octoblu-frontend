'use strict';

angular.module('octobluApp')
    .controller('addGatewayController', function($scope, $state, $stateParams, NodeTypeService, deviceService) {
        $scope.newGateway = {};

        NodeTypeService.getNodeTypes().then(function(nodeTypes){
            $scope.nodeType = _.findWhere(nodeTypes, {_id: $stateParams.deviceId});
        });

        deviceService.getUnclaimedGateways().then(function(unclaimedGateways){
            $scope.newGateway.unclaimedGateways = unclaimedGateways;
            $scope.newGateway.selectedGateway = _.first(unclaimedGateways);
        });

        $scope.addGateway = function() {
          var deviceOptions, promise;
          delete $scope.errorMessage;

          deviceOptions = {
            type: $scope.nodeType.skynet.type,
            subtype: $scope.nodeType.skynet.subtype,
            name: $scope.newGateway.name
          };

          if($scope.newGateway.selectedGateway) {
            deviceOptions.uuid = $scope.newGateway.selectedGateway.uuid;
            promise = deviceService.claimAndUpdateDevice(deviceOptions);
          } else {
            promise = deviceService.registerDevice(deviceOptions);
          }

          promise.then(function(){
            $state.go("ob.connector.devices.all");
          }, function(error){
            $scope.errorMessage = error;
          });
        };
    });
