angular.module('octobluApp')
    .controller('DeviceController', function (skynetService, $scope, $q, $log,
                                              $state, $http, $cookies, $modal, $timeout, currentUser, myDevices, availableDeviceTypes, deviceService) {

        $scope.user = currentUser;
        $scope.smartDevices = availableDeviceTypes;
        $scope.devices = myDevices;

        $scope.deleteDevice = function (device) {
            $scope.confirmModal($modal, $scope, $log, 'Delete Device ' + device.name, 'Are you sure you want to delete this Device?',
                function () {
                    deviceService.deleteDevice(device.uuid, currentUser.skynetuuid, currentUser.skynettoken)
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

        $scope.addSmartDevice = function (smartDevice) {
            if (smartDevice.enabled) {
                var subdeviceModal = $modal.open({
                    templateUrl: 'pages/connector/devices/subdevice/add-edit.html',
                    controller: 'AddEditSubDeviceController',
                    backdrop: true,
                    resolve: {
                        selectedHub: function () {
                            return null;
                        },
                        plugin: function () {
                            return _.findWhere(hub.plugins, {name: subdeviceType});
                        },
                        subdevice: function () {
                            return null;
//                            if (!subdevice) {
//                                return  PluginService.getDefaultOptions(hub, subdeviceType)
//                                    .then(function (response) {
//                                        return {options: response.result };
//                                    }, function (error) {
//                                        console.log(error);
//                                        return { options: {}};
//                                    });
//                            } else {
//                                return subdevice;
//                            }
                        },
                        hubs : function(){
                           return _.filter($scope.devices, {type : 'gateway'});
                        },
                        availableDeviceTypes: function () {
                            return availableDeviceTypes;
                        }
                    }
                });

                subdeviceModal.result.then(function (updatedSubdevice) {
                    if (!subdevice) {
                        skynetService.createSubdevice({
                            uuid: hub.uuid,
                            token: hub.token,
                            type: subdeviceType,
                            name: updatedSubdevice.name,
                            options: updatedSubdevice.options
                        }).then(function (response) {
                            hub.subdevices.push(response.result);
                        });
                    } else {
                        skynetService.updateSubdevice({
                            uuid: hub.uuid,
                            token: hub.token,
                            type: subdeviceType,
                            name: updatedSubdevice.name,
                            options: updatedSubdevice.options
                        }).then(function (response) {
                            console.log(response);
                            angular.copy(updatedSubdevice, subdevice);
                        });
                    }

                }, function () {
                    console.log('cancelled');
                });

//                var subdeviceModal = $modal.open({
//                    templateUrl: 'pages/connector/devices/subdevice/add-edit.html',
//                    controller: 'AddEditSubDeviceController',
//                    backdrop: true,
//                    resolve: {
//                        mode: function () {
//                            return 'ADD';
//                        },
//                        hubs: function () {
//                            return _.filter($scope.devices, function (device) {
//                                return device.type === 'gateway';
//                            });
//                        },
//                        smartDevice: function () {
//                            return smartDevice;
//                        }
//                    }
//
//                });
//
//                subdeviceModal.result.then(function (result) {
//                    skynetService.gatewayConfig({
//                        "uuid": result.hub.uuid,
//                        "token": result.hub.token,
//                        "method": "createSubdevice",
//                        "type": result.device.plugin,
//                        "name": result.name,
//                        "options": result.options
//                    }).then(function (addResult) {
//                        console.log(addResult);
//                    });
//
//                    result.hub.subdevices.push({
//                        name: result.name,
//                        type: result.device.plugin,
//                        options: result.options
//                    });
//                }, function () {
//
//                });
            }
        }


    })
    .controller('DeviceEditController', function ($scope, skynetService) {

        $scope.editSubDevice = function (subdevice, hub) {

            /*
             TODO
             * Check if the sub device is installed for the current hub
             * install the sub device refresh the current device to get the list of updated plugins installed
             * pass the installed plugin for the sub-device to the modal to the modal
             *
             */
            var subDeviceModal = $modal.open({
                templateUrl: 'pages/connector/devices/subdevice/edit.html',
                controller: 'EditSubDeviceController',
                backdrop: true,
                resolve: {
                    mode: function () {
                        return 'EDIT';
                    },

                    subdevice: function () {
                        return subdevice;
                    },

                    hub: function () {
                        return hub;
                    },
                    smartDevices: function () {
                        return $scope.smartDevices;
                    },
                    plugins: function () {
                        return hub.plugins;
                    }
                }
            });

            subDeviceModal.result.then(function (options) {
                skynetService.gatewayConfig({
                    "uuid": hub.uuid,
                    "token": hub.token,
                    "method": "updateSubdevice",
                    "type": subdevice.type,
                    "name": subdevice.name,
                    "options": options
                }).then(function (updateResult) {
                    console.log(updateResult);
                });
                subdevice.options = options;
            }, function () {

            });

        };

        $scope.deleteSubDevice = function (subdevice, hub) {
            $rootScope.confirmModal($modal, $scope, $log,
                    'Delete Subdevice' + subdevice.name,
                    'Are you sure you want to delete' + subdevice.name + ' attached to ' + hub.name + ' ?',
                function () {
                    $log.info('ok clicked');
                    skynetService.gatewayConfig({
                        "uuid": hub.uuid,
                        "token": hub.token,
                        "method": "deleteSubdevice",
                        "name": subdevice.name
                    }).then(
                        function (deleteResult) {
                            if (deleteResult.result === 'ok') {
                                hub.subdevices = _.without(hub.subdevices, subdevice);
                            }
                        });
                });
        };

    })
    .controller('DeviceDetailController', function ($modal, $log, $scope, $state, $stateParams, currentUser, myDevices, PermissionsService, skynetService) {
        var device = _.findWhere(myDevices, { uuid: $stateParams.uuid });
        $scope.device = device;
        PermissionsService
            .allSourcePermissions(currentUser.skynetuuid, currentUser.skynettoken, $scope.device.resource.uuid)
            .then(function (permissions) {
                $scope.sourcePermissions = permissions;
            });
        PermissionsService
            .flatSourcePermissions(currentUser.skynetuuid, currentUser.skynettoken, $scope.device.resource.uuid)
            .then(function (permissions) {
                $scope.sourceGroups = _.uniq(permissions, function (permission) {
                    return permission.uuid;
                });
            });

        PermissionsService
            .flatTargetPermissions(currentUser.skynetuuid, currentUser.skynettoken, $scope.device.resource.uuid)
            .then(function (permissions) {
                $scope.targetGroups = _.uniq(permissions, function (permission) {
                    return permission.uuid;
                });
            });

        PermissionsService
            .allTargetPermissions(currentUser.skynetuuid, currentUser.skynettoken, $scope.device.resource.uuid)
            .then(function (permissions) {
                $scope.targetPermissions = permissions;
            });

        $scope.multipleNames = function (permission) {
            return (permission.name instanceof Array);
        };

        if ($scope.device.type === 'gateway') {
            skynetService.gatewayConfig( {
                "uuid": $scope.device.uuid,
                "token": $scope.device.token,
                "method": "configurationDetails",
            }).then(function (response) {
                $scope.device.subdevices = response.result.subdevices || [];
                $scope.device.plugins = response.result.plugins || [];
            });
        }
        $scope.deleteSubdevice = function (subdevice) {
            $scope.confirmModal($modal, $scope, $log, 'Delete Subdevice', 'Are you sure you want to delete this subdevice?',
                function () {
                    skynetService.gatewayConfig({
                        "uuid": device.uuid,
                        "token": device.token,
                        "method": "deleteSubdevice",
                        "name": subdevice.name
                    }).then(function (deleteResult) {
                        device.subdevices = _.without(device.subdevices, subdevice);
                    });
                },
                function () {
                    $log.info('cancel clicked');
                });

        };
        $scope.editSubdevice = function (hub, subdevice) {
            var plugin = _.findWhere($scope.device.plugins, {name: subdevice.type}),
                device = $scope.device;
            var modalInstance = $modal.open({
                templateUrl: 'pages/modals/edit-sub-device.html',
                controller: function ($log, $scope, $modalInstance) {
                    $scope.subdevice = subdevice;
                    $scope.plugin = plugin;
                    $scope.schema = plugin.optionsSchema;

                    var keys = _.keys($scope.schema.properties);
                    $scope.deviceProperties = _.map(keys, function (propertyKey) {
                        var propertyValue = $scope.schema.properties[propertyKey];
                        var deviceProperty = {};
                        deviceProperty.name = propertyKey;
                        deviceProperty.type = propertyValue.type;
                        deviceProperty.required = propertyValue.required;
                        var value = _.findWhere(subdevice.options, {name: propertyKey});
                        if (value) {
                            deviceProperty.value = value.value;
                        }
                        return deviceProperty;
                    });


                    $scope.ok = function () {
                        var deviceProperties = _.map($scope.deviceProperties, function (property) {
                            return _.omit(property, '$$hashKey', 'type', 'required');
                        });

                        var options = {};
                        _.forEach(deviceProperties, function (property) {
                            options[property.name] = property.value;
                        });

                        console.log('updating device properties ', deviceProperties);
                        $modalInstance.close();
                        return skynetService.gatewayConfig({
                            "uuid": device.uuid,
                            "token": device.token,
                            "method": "updateSubdevice",
                            "type": subdevice.type,
                            "name": subdevice.name,
                            "options": deviceProperties
                        }).then(function (updateResult) {
                            subdevice.options = deviceProperties;
                        });
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }
            });
        }
    })
    .controller('DeviceWizardController', function ($rootScope, $cookies, $scope, $state, $http, currentUser, unclaimedDevices, deviceService) {

        $scope.availableGateways = _.filter(unclaimedDevices, function (device) {
            return device.type === 'gateway';
        }) || [];


        $scope.isopen = false;
        $scope.user = currentUser;

        $scope.$watch('hubName', function (newName, oldName, scope) {
            console.log(newName);
            console.log(oldName);

        }, true);

        $scope.$watch('selectedHub', function (newHub, oldHub, scope) {
            console.log(newHub);
            console.log(oldHub);
        }, true);

        $scope.canClaim = function (name, hub) {
//            console.log('checkFinish');
            if (name && name.trim().length > 0 && hub) {
                return true;
            }
            return false;
        };
        //Function to enable or disable the Finish and Claim Hub buttons
        $scope.checkClaim = function (name, hub) {
            if ($scope.canClaim(name, hub)) {
                $('#wizard-finish-btn').removeAttr('disabled');
                $('#wizard-claim-btn').removeAttr('disabled');
            } else {
                $('#wizard-finish-btn').attr('disabled');
                $('#wizard-claim-btn').attr('disabled');
            }
        }

//        Notify the parent scope that a new hub has been selected
        $scope.notifyHubSelected = function (hub) {
            console.log('hub selected notifying parent scope');
            $scope.$emit('hubSelected', hub);
        };

//        Notify the parent scope that the hub name has been changed
        $scope.notifyHubNameChanged = function (name) {
            $scope.$emit('hubNameChanged', name);
        }

//        event handler for updating the hubName selected in the child scope
        $scope.$on('hubNameChanged', function (event, name) {
            $scope.hubName = name;
            event.preventDefault();
        });

//        event handler for updating the hub selected in the child scope.
        $scope.$on('hubSelected', function (event, hub) {
            $scope.selectedHub = hub;
            event.preventDefault();
        });

        $scope.claimHub = function (hub, hubName) {
            if (hub && hubName && hubName.trim().length > 0) {

                deviceService
                    .claimDevice(hub.uuid, currentUser.skynetuuid, currentUser.skynettoken, $scope.hubName)
                    .then(function (result) {
                        //now update the name
                        return deviceService.updateDevice(hub.uuid, currentUser.skynetuuid, currentUser.skynettoken, {
                            name: hubName
                        });
                    }).then(function (device) {
                        $state.go('connector.devices.all', {}, {reload: true});
                    }, function (error) {
                        console.log(error);
                        $state.go('connector.devices.all', {}, {reload: true});
                    });

            }
        };

        $scope.toggleOpen = function () {
            $scope.isopen = !$scope.isopen;
        };

    })
;
