'use strict';

angular.module('octobluApp')
    .controller('smartDeviceController', function ($scope, myDevices, skynetService, currentUser) {

        $scope.devices = _.filter(myDevices, function (device) {
            return device.type !== 'gateway';
        });

        $scope.saveDevice = function () {
            var updatedDevice = $scope.editingDevice;
            if (updatedDevice.uuid) {
                skynetService.updateDevice(updatedDevice).then(function (result) {
                    delete $scope.editingDevice;
                    console.log('made it');
                });
            } else {
                skynetService.registerDevice(updatedDevice).then(function (result) {
                    delete $scope.editingDevice;
                    console.log(result);
                    myDevices.push(result);
                    $scope.devices = _.filter(myDevices, function (device) {
                        return device.type !== 'gateway';
                    });
                });
            }
        };

        $scope.editDevice = function (device) {
            $scope.editingDevice = device;
        };

        $scope.newDevice = function () {
            $scope.editDevice({ owner: currentUser.skynetuuid, name: '' });
        };

        $scope.deleteDevice = function (device) {
            skynetService.unregisterDevice({ uuid: device.uuid})
                .then(function (result) {
                    $scope.devices = _.without($scope.devices, device);
                });

        };
    });
