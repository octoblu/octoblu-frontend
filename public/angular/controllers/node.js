'use strict';
angular.module('octobluApp')
    .controller('NodeController', function ($scope, $state, NodeService) {

        NodeService.getAllNodes().then(function(nodes){
            $scope.nodes = nodes;
        });

        $scope.nextStepUrl = function(node){
            var sref = 'ob.connector.node'+ node.category + '-detail';
            var params = {};
            if(node.category === 'device'){
                params.uuid = node.uuid;
            } else if(node.category === 'channel'){
               params.channelId = node._id;
            }
            return $state.href(sref, params);
        };

//        $scope.user = currentUser;
//
//        $scope.subDeviceTypes = _.filter(availableDeviceTypes, function (device) {
//            return device.skynet.plugin;
//        });
//        $scope.deviceTypes = _.difference(availableDeviceTypes, $scope.subDeviceTypes);
//
//        $scope.devices = myDevices;
//        $scope.hasHubs = myGateways.length;
//
//        $scope.getDeviceTypeLogo = function (device) {
//            if (device) {
//                var deviceType = _.findWhere(availableDeviceTypes, function (deviceType) {
//                    if (device.type) {
//                        if (device.subtype && deviceType.skynet) {
//                            return deviceType.skynet.type === device.type && deviceType.skynet.subtype === device.subtype;
//                        } else {
//                            return deviceType.skynet.type === device.type;
//                        }
//                    } else {
//                        return deviceType.skynet.type === 'device' && deviceType.skynet.subtype === 'other';
//                    }
//                });
//                return deviceType ? deviceType.logo : null;
//            }
//        };

//        $scope.deleteDevice = function (device) {
//            $scope.confirmModal($modal, $scope, $log, 'Delete Device ' + device.name, 'Are you sure you want to delete this Device?',
//                function () {
//                    deviceService.unregisterDevice(device)
//                        .then(function (devices) {
//                            console.log(devices);
//                        }, function (error) {
//                            console.log(error);
//                        });
//                },
//                function () {
//                    $log.info('cancel clicked');
//                });
//
//        };


//        $scope.addSubdevice = function (deviceType) {
//            if (deviceType.enabled) {
//                var subdeviceModal = $modal.open({
//                    templateUrl: 'pages/connector/devices/subdevice/add-edit.html',
//                    controller: 'AddEditSubDeviceController',
//                    backdrop: true,
//                    resolve: {
//                        pluginName: function () {
//                            return deviceType.skynet.plugin;
//                        },
//                        subdevice: function () {
//                            return null;
//                        },
//                        hubs: function () {
//                            return myGateways;
//                        },
//                        availableDeviceTypes: function () {
//                            return availableDeviceTypes;
//                        }
//                    },
//                    size: 'lg'
//                });
//
//                subdeviceModal.result.then(function (result) {
//                    deviceService.createSubdevice({
//                        uuid: result.hub.uuid,
//                        token: result.hub.token,
//                        type: deviceType.skynet.plugin,
//                        name: result.subdevice.name,
//                        options: result.subdevice.options
//                    }).then(function (response) {
//                        var device = _.findWhere(myDevices, {uuid: result.hub.uuid});
//                        device.subdevices.push(response.result);
//                    });
//
//                }, function () {
//                    console.log('cancelled');
//                });
//            }
//        };

//        $scope.addDevice = function (deviceType) {
//            if (deviceType.enabled) {
//                var deviceModal = $modal.open({
//                    templateUrl: 'pages/connector/devices/device/add-edit.html',
//                    controller: 'AddEditDeviceController',
//                    backdrop: true,
//                    resolve: {
//                        device: function () {
//                            return null;
//                        },
//                        owner: function () {
//                            return currentUser;
//                        },
//                        deviceType: function () {
//                            return deviceType;
//                        },
//                        availableDeviceTypes: function () {
//                            return availableDeviceTypes;
//                        }
//                    }
//                });
//
//                deviceModal.result.then(function (result) {
//                    deviceService.registerDevice(result.device)
//                        .then(null, function (error) {
//                            console.log(error);
//                        });
//                }, function () {
//                    console.log('cancelled');
//                });
//            }
//        };

//        $scope.editDevice = function (device) {
//            var deviceType = _.findWhere(availableDeviceTypes, function (deviceType) {
//                if (device.type) {
//                    if (device.subtype) {
//                        return deviceType.skynet.type === device.type && deviceType.skynet.subtype === device.subtype;
//                    } else {
//                        return deviceType.skynet.type === device.type;
//                    }
//                } else {
//                    return deviceType.skynet.type === 'device' && deviceType.skynet.subtype === 'other';
//                }
//            });
//
//            var deviceModal = $modal.open({
//                templateUrl: 'pages/connector/devices/device/add-edit.html',
//                controller: 'AddEditDeviceController',
//                backdrop: true,
//                resolve: {
//                    device: function () {
//                        return device;
//                    },
//                    owner: function () {
//                        return currentUser;
//                    },
//                    deviceType: function () {
//                        return deviceType;
//                    },
//                    availableDeviceTypes: function () {
//                        return availableDeviceTypes;
//                    }
//                },
//                size: 'lg'
//            });
//
//            deviceModal.result.then(function (result) {
//                deviceService.updateDevice(result.device)
//                    .then(null, function (error) {
//                        console.log(error);
//                    });
//            }, function () {
//                console.log('cancelled');
//            });
//        };
    });
