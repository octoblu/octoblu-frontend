'use strict';

angular.module('octobluApp')
    .controller('smartDeviceController', function ($scope, $modal, $log, deviceService,  myDevices, currentUser, availableDeviceTypes) {

        $scope.model = {
            devices : myDevices,
            deviceTypes : _.filter(availableDeviceTypes, function(deviceType){
                return deviceType.skynet.type == 'device' && ! deviceType.skynet.plugin
            })
        };

        $scope.notGateway = function(device) {
            return device && device.type !== 'gateway';
        };

        $scope.deleteDevice = function (device) {
            $scope.confirmModal($modal, $scope, $log, 'Delete Device ' + device.name, 'Are you sure you want to delete this Device?',
                function () {
                    deviceService.unregisterDevice({uuid: device.uuid})
                        .then(function (device) {
                            if (device) {
                                $scope.model.devices = _.without($scope.model.devices, _.findWhere($scope.model.devices, {uuid: device.uuid}));
                            }
                        }, function (error) {
                        });
                },
                function () {
                    $log.info('cancel clicked');
                });

        };


        $scope.addDevice = function (deviceType) {
            if (deviceType.enabled) {
                var deviceModal = $modal.open({
                    templateUrl: 'pages/connector/devices/device/add-edit.html',
                    controller: 'AddEditDeviceController',
                    backdrop: true,
                    resolve: {
                        device: function () {
                            return null;
                        },
                        owner: function () {
                            return currentUser;
                        },
                        deviceType: function () {
                            return deviceType;
                        },
                        availableDeviceTypes: function () {
                            return availableDeviceTypes;
                        }
                    }
                });

                deviceModal.result.then(function (result) {
                    deviceService.registerDevice(result.device)
                        .then(function (res) {
                            return deviceService.getDevices(true);
                        }).then(null, function (error) {
                            console.log(error);
                        });
                }, function () {
                    console.log('cancelled');
                });
            }
        };

        $scope.editDevice = function (device) {
            var deviceType = _.findWhere(availableDeviceTypes, function (deviceType) {
                if (device.type) {
                    if (device.subtype) {
                        return deviceType.skynet.type === device.type && deviceType.skynet.subtype === device.subtype;
                    } else {
                        return deviceType.skynet.type === device.type;
                    }
                } else {
                    return deviceType.skynet.type === 'device' && deviceType.skynet.subtype === 'other';
                }
            });

            var deviceModal = $modal.open({
                templateUrl: 'pages/connector/devices/device/add-edit.html',
                controller: 'AddEditDeviceController',
                backdrop: true,
                resolve: {
                    device: function () {
                        return device;
                    },
                    owner: function () {
                        return currentUser;
                    },
                    deviceType: function () {
                        return deviceType;
                    },
                    availableDeviceTypes: function () {
                        return availableDeviceTypes;
                    }
                },
                size: 'lg'
            });

            deviceModal.result.then(function (result) {
                deviceService.updateDevice(result.device)
                    .then(function (res) {
                        return deviceService.getDevices(true);
                    }).then(null, function (error) {
                        console.log(error);
                    });
            }, function () {
                console.log('cancelled');
            });
        };
    });
