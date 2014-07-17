'use strict';

angular.module('octobluApp')
    .controller('hubController', function ($scope, $modal, myDevices, myGateways, currentUser, PluginService, availableDeviceTypes, deviceService) {

        $scope.claimedHubs = myGateways;
        $scope.availableDeviceTypes = _.filter(availableDeviceTypes, function(deviceType){
            return deviceType.skynet.plugin && deviceType.enabled;
        });

        $scope.editSubdevice = function (hub, subdeviceType, subdevice) {
            return $scope.configureSubdevice(hub, subdeviceType, subdevice);
        };

        $scope.configureSubdevice = function (hub, subdeviceType, subdevice) {

            var subdeviceModal = $modal.open({
                templateUrl: 'pages/connector/devices/subdevice/add-edit.html',
                controller: 'AddEditSubDeviceController',
                backdrop: true,
                resolve: {
                    hubs: function () {
                        return [hub];
                    },
                    pluginName: function () {
                        return subdeviceType;
                    },
                    subdevice: function () {
                        if (!subdevice) {
                            return  PluginService.getDefaultOptions(hub, subdeviceType)
                                .then(function (response) {
                                    return {options: response.result, type: subdeviceType };
                                }, function (error) {
                                    console.log(error);
                                    return { options: {}, type: subdeviceType};
                                });
                        } else {
                            return subdevice;
                        }
                    },
                    availableDeviceTypes: function () {
                        return availableDeviceTypes;
                    }
                }
            });

            subdeviceModal.result.then(function (result) {
                var hub = result.hub, updatedSubdevice = result.subdevice;
                if (!subdevice) {
                    deviceService.createSubdevice({
                        uuid: hub.uuid,
                        token: hub.token,
                        type: subdeviceType,
                        name: updatedSubdevice.name,
                        options: updatedSubdevice.options
                    }).then(function (response) {
                        hub.subdevices.push(response.result);
                    });
                } else {
                    deviceService.updateSubdevice({
                        uuid: hub.uuid,
                        token: hub.token,
                        type: subdeviceType,
                        name: updatedSubdevice.name,
                        options: updatedSubdevice.options
                    }).then(function (response) {
                        console.log(response);
                    });
                }

            }, function () {
                console.log('cancelled');
            });
        };

        $scope.deleteSubdevice = function (hub, subdevice) {
            deviceService.deleteSubdevice({
                "uuid": hub.uuid,
                "token": hub.token,
                "name": subdevice.name
            }).then(function (response) {
                console.log(response);
                hub.subdevices = _.without(hub.subdevices, subdevice);
            });
        };

        $scope.addPlugin = function (hub) {

        };

        $scope.deletePlugin = function (hub, plugin) {
            PluginService.uninstallPlugin(hub, plugin.name)
                .then(function (result) {
                    console.log(result);
                    hub.plugins = _.without(hub.plugins, plugin);
                });

        };
    });
