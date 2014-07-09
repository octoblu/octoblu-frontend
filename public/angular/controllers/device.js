angular.module('octobluApp')
    .controller('DeviceController', function (skynetService, $scope, $q, $log, $state, $http, $modal, $timeout, currentUser, myDevices, myGateways, availableDeviceTypes, deviceService, PluginService) {

        $scope.user = currentUser;

        $scope.subDeviceTypes = _.filter(availableDeviceTypes, function (device) {
            return device.skynet.plugin;
        });
        $scope.deviceTypes = _.difference(availableDeviceTypes, $scope.subDeviceTypes);

        $scope.devices = myDevices;
        $scope.hasHubs = myGateways.length;

        $scope.getDeviceTypeLogo = function (device) {
            if (device) {
                var deviceType = _.findWhere(availableDeviceTypes, function (deviceType) {
                    if (device.type) {
                        if (device.subtype && deviceType.skynet) {
                            return deviceType.skynet.type === device.type && deviceType.skynet.subtype === device.subtype;
                        } else {
                            return deviceType.skynet.type === device.type;
                        }
                    } else {
                        return deviceType.skynet.type === 'device' && deviceType.skynet.subtype === 'other';
                    }
                });
                return deviceType ? deviceType.logo : null;
            }
        };

        $scope.deleteDevice = function (device) {
            $scope.confirmModal($modal, $scope, $log, 'Delete Device ' + device.name, 'Are you sure you want to delete this Device?',
                function () {
                    deviceService.deleteDevice(device.uuid)
                        .then(function (device) {
                            if (device) {
                                $scope.devices = _.without($scope.devices, _.findWhere($scope.devices, {uuid: device.uuid}));
                            }
                        }, function (error) {
                        });
                },
                function () {
                    $log.info('cancel clicked');
                });

        };


        $scope.addSubdevice = function (deviceType) {
            if (deviceType.enabled) {
                var subdeviceModal = $modal.open({
                    templateUrl: 'pages/connector/devices/subdevice/add-edit.html',
                    controller: 'AddEditSubDeviceController',
                    backdrop: true,
                    resolve: {
                        pluginName: function () {
                            return deviceType.skynet.plugin;
                        },
                        subdevice: function () {
                            return null;
                        },
                        hubs: function () {
                            return myGateways;
                        },
                        availableDeviceTypes: function () {
                            return availableDeviceTypes;
                        }
                    },
                    size : 'lg'
                });

                subdeviceModal.result.then(function (result) {
                    skynetService.createSubdevice({
                        uuid: result.hub.uuid,
                        token: result.hub.token,
                        type: deviceType.skynet.plugin,
                        name: result.subdevice.name,
                        options: result.subdevice.options
                    }).then(function (response) {
                        result.hub.subdevices.push(response.result);
                        var device = _.findWhere($scope.devices, {uuid: result.hub.uuid});
                        device.subdevices.push(response.result);
                    });

                }, function () {
                    console.log('cancelled');
                });
            }
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
                    skynetService.registerDevice(result.device)
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
                skynetService.updateDevice(result.device)
                    .then(function (res) {
                        return deviceService.getDevices(true);
                    }).then(null, function (error) {
                        console.log(error);
                    });
            }, function () {
                console.log('cancelled');
            });
        };
    })
    .controller('AddEditDeviceController', function ($scope, $modalInstance, owner, device, deviceType, availableDeviceTypes) {
        $scope.model = {
            isNew: !device,
            device: angular.copy(device) || {},
            deviceType: deviceType,
            deviceTypes: availableDeviceTypes,
            propertyEditor: {},
            schema : deviceType.optionsSchema || {}
        };


        $scope.cancel = function () {
            $modalInstance.dismiss();
        };

        $scope.save = function () {
            //If the deviceType selected has an options schema then we should validate the
            //options set for errors
                var errors = $scope.model.propertyEditor.validate();
                if (!errors.length) {
                    var device = $scope.model.propertyEditor.getValue();
                    angular.extend($scope.model.device, device);
                    $scope.model.device.owner = $scope.model.device.owner || owner.skynetuuid;
                    $scope.model.device.type = $scope.model.deviceType.skynet.type;
                    $scope.model.device.subtype = $scope.model.deviceType.skynet.subtype || '';
                    $modalInstance.close({deviceType: $scope.model.deviceType, device: $scope.model.device, isNew: $scope.model.isNew});
                }
        };
    });
