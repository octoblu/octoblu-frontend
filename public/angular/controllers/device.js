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
            }
        }
    })
