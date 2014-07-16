'use strict';

angular.module('octobluApp')
    .controller('addDeviceController', function($scope, $state, $stateParams, NodeTypeService, skynetService) {
        $scope.newDevice = {};

        NodeTypeService.getNodeTypes().then(function(nodeTypes){
            $scope.nodeType = _.findWhere(nodeTypes, {_id: $stateParams.deviceId});
        });

        $scope.addDevice = function() {
          var deviceOptions;
          delete $scope.errorMessage;

          deviceOptions = {
            type: $scope.nodeType.skynet.type,
            subtype: $scope.nodeType.skynet.subtype,
            name: $scope.newDevice.name
          };

          skynetService.registerDevice(deviceOptions).then(function(){
            $state.go("ob.connector.devices.all");
          }, function(error){
            $scope.errorMessage = error;
          });
        };
    });
