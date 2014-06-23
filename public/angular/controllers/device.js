angular.module('octobluApp')
    .controller('DeviceController', function (skynetService, $scope, $q, $log, $state, $http, $cookies, $modal, $timeout, currentUser, myDevices, myGateways, availableDeviceTypes, deviceService) {

        $scope.user = currentUser;
        $scope.smartDevices = availableDeviceTypes;
        $scope.devices = myDevices;
        $scope.hasHubs = !! myGateways.length;

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

        $scope.addSmartDevice = function (availableDeviceType) {

            if (availableDeviceType.enabled) {
                var subdeviceModal = $modal.open({
                    templateUrl: 'pages/connector/devices/subdevice/add-edit.html',
                    controller: 'AddEditSubDeviceController',
                    backdrop: true,
                    resolve: {
                        pluginName: function () {
                            return availableDeviceType.plugin;
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
                    }
                });

                subdeviceModal.result.then(function (result) {
                        var hub = result.hub, updatedSubdevice = result.subdevice;
                        skynetService.createSubdevice({
                            uuid: hub.uuid,
                            token: hub.token,
                            type: updatedSubdevice.type,
                            name: updatedSubdevice.name,
                            options: updatedSubdevice.options
                        }).then(function (response) {
                            hub.subdevices.push(response.result);
                        });
                    },
                    function () {
                        console.log('cancelled');
                    });
            }
        }


    })
    .controller('DeviceEditController', function ($scope, skynetService) {

        $scope.editSubDevice = function (subdevice, hub) {

            var subdeviceModal = $modal.open({
                templateUrl: 'pages/connector/devices/subdevice/add-edit.html',
                controller: 'AddEditSubDeviceController',
                backdrop: true,
                resolve: {
                    hubs: function () {
                        return [hub];
                    },
                    pluginName: function () {
                        return subdevice.type;
                    },
                    subdevice: function () {
                     return subdevice;
                    },
                    availableDeviceTypes: function () {
                        return availableDeviceTypes;
                    }
                }
            });

            subdeviceModal.result.then(function (result) {
                var hub = result.hub, updatedSubdevice = result.subdevice;
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

        };

        $scope.deleteSubDevice = function (subdevice, hub) {
            $rootScope.confirmModal($modal, $scope, $log,
                    'Delete Subdevice' + subdevice.name,
                    'Are you sure you want to delete' + subdevice.name + ' attached to ' + hub.name + ' ?',
                function () {
                    $log.info('ok clicked');
                    skynetService.deleteSubdevice({
                        "uuid": hub.uuid,
                        "token": hub.token,
                        "name": subdevice.name
                    }).then(
                        function (response) {
                            console.log(response);
                            hub.subdevices = _.without(hub.subdevices, subdevice);
                        });
                });
        };

    })
    .controller('DeviceDetailController', function ($modal, $log, $scope, $state, $stateParams, currentUser, myDevices, availableDeviceTypes, PermissionsService, skynetService) {
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
            skynetService.gatewayConfig({
                "uuid": $scope.device.uuid,
                "token": $scope.device.token,
                "method": "configurationDetails"
            }).then(function (response) {
                $scope.device.subdevices = response.result.subdevices || [];
                $scope.device.plugins = response.result.plugins || [];
            });
        }
        $scope.deleteSubdevice = function (hub, subdevice) {
            skynetService.deleteSubdevice({
                "uuid": hub.uuid,
                "token": hub.token,
                "name": subdevice.name
            }).then(function (response) {
                console.log(response);
                hub.subdevices = _.without(hub.subdevices, subdevice);
            });
        };
        $scope.editSubdevice = function (hub, subdevice) {
            var subdeviceModal = $modal.open({
                templateUrl: 'pages/connector/devices/subdevice/add-edit.html',
                controller: 'AddEditSubDeviceController',
                backdrop: true,
                resolve: {
                    hubs: function () {
                        return [hub];
                    },
                    pluginName: function () {
                        return subdevice.type;
                    },
                    subdevice: function () {
                      return subdevice;
                    },
                    availableDeviceTypes: function () {
                        return availableDeviceTypes;
                    }
                }
            });

            subdeviceModal.result.then(function (result) {
                    skynetService.updateSubdevice({
                        uuid: result.hub.uuid,
                        token: result.hub.token,
                        type: result.subdevice.type,
                        name: result.subdevice.name,
                        options: result.subdevice.options
                    }).then(function (response) {
                        console.log(response);
                        angular.copy(result.subdevice, subdevice);
                    });

            }, function () {
                console.log('cancelled');
            });
        }
    })
    .controller('DeviceWizardController', function ($rootScope, $cookies, $scope, $state, $http, currentUser, unclaimedDevices, deviceService) {

        $scope.availableGateways = _.filter(unclaimedDevices, function (device) {
            return device.type === 'gateway' && device.online === true;
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
