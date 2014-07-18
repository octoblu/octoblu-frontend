angular.module('octobluApp')
    .controller('DeviceController', function ($scope, $q, $log, $state, $http, $modal, $timeout, currentUser, myDevices, myGateways, availableNodeTypes, deviceService, PluginService) {

        $scope.user = currentUser;

        $scope.subnodeTypes = _.filter(availableNodeTypes, function (device) {
            return device.skynet.plugin;
        });
        $scope.nodeTypes = _.difference(availableNodeTypes, $scope.subnodeTypes);

        $scope.devices = myDevices;
        $scope.hasHubs = myGateways.length;

        $scope.getnodeTypeLogo = function (device) {
            if (device) {
                var nodeType = _.findWhere(availableNodeTypes, function (nodeType) {
                    if (device.type) {
                        if (device.subtype && nodeType.skynet) {
                            return nodeType.skynet.type === device.type && nodeType.skynet.subtype === device.subtype;
                        } else {
                            return nodeType.skynet.type === device.type;
                        }
                    } else {
                        return nodeType.skynet.type === 'device' && nodeType.skynet.subtype === 'other';
                    }
                });
                return nodeType ? nodeType.logo : null;
            }
        };

        $scope.deleteDevice = function (device) {
            $scope.confirmModal($modal, $scope, $log, 'Delete Device ' + device.name, 'Are you sure you want to delete this Device?',
                function () {
                    deviceService.unregisterDevice(device)
                        .then(function (devices) {
                            console.log(devices);
                        }, function (error) {
                            console.log(error);
                        });
                },
                function () {
                    $log.info('cancel clicked');
                });

        };


        $scope.addSubdevice = function (nodeType) {
            if (nodeType.enabled) {
                var subdeviceModal = $modal.open({
                    templateUrl: 'pages/connector/devices/subdevice/add-edit.html',
                    controller: 'AddEditSubDeviceController',
                    backdrop: true,
                    resolve: {
                        pluginName: function () {
                            return nodeType.skynet.plugin;
                        },
                        subdevice: function () {
                            return null;
                        },
                        hubs: function () {
                            return myGateways;
                        },
                        availableNodeTypes: function () {
                            return availableNodeTypes;
                        }
                    },
                    size: 'lg'
                });

                subdeviceModal.result.then(function (result) {
                    deviceService.createSubdevice({
                        uuid: result.hub.uuid,
                        token: result.hub.token,
                        type: nodeType.skynet.plugin,
                        name: result.subdevice.name,
                        options: result.subdevice.options
                    }).then(function (response) {
                        var device = _.findWhere(myDevices, {uuid: result.hub.uuid});
                        device.subdevices.push(response.result);
                    });

                }, function () {
                    console.log('cancelled');
                });
            }
        };

        $scope.addDevice = function (nodeType) {
            if (nodeType.enabled) {
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
                        nodeType: function () {
                            return nodeType;
                        },
                        availableNodeTypes: function () {
                            return availableNodeTypes;
                        }
                    }
                });

                deviceModal.result.then(function (result) {
                    deviceService.registerDevice(result.device)
                        .then(null, function (error) {
                            console.log(error);
                        });
                }, function () {
                    console.log('cancelled');
                });
            }
        };

        $scope.editDevice = function (device) {
            var nodeType = _.findWhere(availableNodeTypes, function (nodeType) {
                if (device.type) {
                    if (device.subtype) {
                        return nodeType.skynet.type === device.type && nodeType.skynet.subtype === device.subtype;
                    } else {
                        return nodeType.skynet.type === device.type;
                    }
                } else {
                    return nodeType.skynet.type === 'device' && nodeType.skynet.subtype === 'other';
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
                    nodeType: function () {
                        return nodeType;
                    },
                    availableNodeTypes: function () {
                        return availableNodeTypes;
                    }
                },
                size: 'lg'
            });

            deviceModal.result.then(function (result) {
                deviceService.updateDevice(result.device)
                  .then(null, function (error) {
                        console.log(error);
                    });
            }, function () {
                console.log('cancelled');
            });
        };
    })
    .controller('AddEditDeviceController', function ($scope, $modalInstance, owner, device, nodeType, availableNodeTypes) {
        $scope.model = {
            isNew: !device,
            device: angular.copy(device) || {},
            nodeType: nodeType,
            nodeTypes: availableNodeTypes,
            propertyEditor: {},
            schema: nodeType.optionsSchema || {}
        };


        $scope.cancel = function () {
            $modalInstance.dismiss();
        };

        $scope.save = function () {
            //If the nodeType selected has an options schema then we should validate the
            //options set for errors
            var errors = $scope.model.propertyEditor.validate();
            if (!errors.length) {
                var device = $scope.model.propertyEditor.getValue();
                angular.extend($scope.model.device, device);
                $scope.model.device.owner = $scope.model.device.owner || owner.skynetuuid;
                $scope.model.device.type = $scope.model.nodeType.skynet.type;
                $scope.model.device.subtype = $scope.model.nodeType.skynet.subtype || '';
                $modalInstance.close({nodeType: $scope.model.nodeType, device: $scope.model.device, isNew: $scope.model.isNew});
            }
        };
    });
