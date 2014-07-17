angular.module('octobluApp')
    .controller('DeviceEditController', function ($scope, deviceService) {


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
                deviceService.gatewayConfig({
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
                    deviceService.gatewayConfig({
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
    .controller('DeviceDetailController', function ($modal, $log, $scope, $state, $stateParams, currentUser, myDevices, availableDeviceTypes, PermissionsService, deviceService) {
        var device = _.findWhere(myDevices, { uuid: $stateParams.uuid });
        $scope.device = device;

        $scope.$on('skynet:message:' + device.uuid, function (event, message) {
        });
        PermissionsService
            .allSourcePermissions($scope.device.uuid)
            .then(function (permissions) {
                $scope.sourcePermissions = permissions;
            });
        PermissionsService
            .flatSourcePermissions($scope.device.uuid)
            .then(function (permissions) {
                $scope.sourceGroups = _.uniq(permissions, function (permission) {
                    return permission.uuid;
                });
            });

        PermissionsService
            .flatTargetPermissions($scope.device.uuid)
            .then(function (permissions) {
                $scope.targetGroups = _.uniq(permissions, function (permission) {
                    return permission.uuid;
                });
            });

        PermissionsService
            .allTargetPermissions($scope.device.uuid)
            .then(function (permissions) {
                $scope.targetPermissions = permissions;
            });

        $scope.multipleNames = function (permission) {
            return (permission.name instanceof Array);
        };

        if ($scope.device.type === 'gateway') {
            deviceService.gatewayConfig({
                uuid: $scope.device.uuid,
                token: $scope.device.token,
                method: "configurationDetails"
            }).then(function (response) {
                if (response && response.result) {
                    $scope.device.subdevices = response.result.subdevices || [];
                    $scope.device.plugins = response.result.plugins || [];
                }
            });
        }
        $scope.deleteSubdevice = function (subdevice) {
            $scope.confirmModal($modal, $scope, $log, 'Delete Subdevice', 'Are you sure you want to delete this subdevice?',
                function () {
                    deviceService.gatewayConfig({
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

        $scope.editSubdevice = function (subdevice) {
            var subdeviceModal = $modal.open({
                templateUrl: 'pages/connector/devices/subdevice/add-edit.html',
                controller: 'AddEditSubDeviceController',
                backdrop: true,
                resolve: {
                    hubs: function () {
                        return [device];
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
                deviceService.updateSubdevice({
                    uuid: hub.uuid,
                    token: hub.token,
                    type: subdevice.type,
                    name: updatedSubdevice.name,
                    options: updatedSubdevice.options
                }).then(function (response) {
                    console.log(response);
                });

            }, function () {
                console.log('cancelled');
            });
        };
    });
