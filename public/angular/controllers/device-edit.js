angular.module('octobluApp')
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

        $scope.$on('skynet:message:' + device.uuid, function(event, message){
        });
        PermissionsService
            .allSourcePermissions($scope.device.resource.uuid)
            .then(function (permissions) {
                $scope.sourcePermissions = permissions;
            });
        PermissionsService
            .flatSourcePermissions($scope.device.resource.uuid)
            .then(function (permissions) {
                $scope.sourceGroups = _.uniq(permissions, function (permission) {
                    return permission.uuid;
                });
            });

        PermissionsService
            .flatTargetPermissions($scope.device.resource.uuid)
            .then(function (permissions) {
                $scope.targetGroups = _.uniq(permissions, function (permission) {
                    return permission.uuid;
                });
            });

        PermissionsService
            .allTargetPermissions($scope.device.resource.uuid)
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
    });
