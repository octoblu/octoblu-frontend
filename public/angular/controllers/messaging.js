'use strict';

angular.module('octobluApp')
    .controller('MessagingController', function ($scope, currentUser, myDevices, myGateways, availableDeviceTypes, skynetService, PluginService) {

        $scope.model = {
            devices : _.sortBy(_.cloneDeep(myDevices), 'name'),
            deviceTypes : availableDeviceTypes,
            schemaEditor : {}

        };



        $scope.model.devices.unshift({
            name: 'Me',
            uuid: currentUser.skynetuuid,
            token: currentUser.skynettoken,
            type: 'user'
        });


        $scope.$watch('model.sendUuid', function (newValue, oldValue) {
            if (newValue || $scope.model.device) {
                $scope.model.schema = {};
            } else {
                delete $scope.model.schema;
            }
        });

        $scope.$watch('model.device', function (newDevice, oldDevice) {
            $scope.model.subdevice = null;
            if (newDevice || $scope.model.sendUuid) {
                if (newDevice.type !== 'gateway') {
                    $scope.model.schema = {};
                } else {
                    skynetService.gatewayConfig({
                        uuid: newDevice.uuid,
                        token: newDevice.token,
                        method: "configurationDetails"
                    }).then(function (response) {
                        if (response && response.result) {
                            $scope.model.device.subdevices = response.result.subdevices || [];
                            $scope.model.device.plugins = response.result.plugins || [];
                        }
                    });
                }
            } else {
                delete $scope.model.schema;
            }
        });

        $scope.$watch('model.subdevice', function (newSubdevice, oldSubdevice) {
            if (newSubdevice) {
                var plugin = _.findWhere($scope.model.device.plugins, {name: newSubdevice.type});
                if (!plugin) {
                    PluginService.installPlugin($scope.model.device, newSubdevice.type)
                        .then(function (result) {
                            return PluginService.getInstalledPlugins($scope.model.device);
                        })
                        .then(function (result) {
                            console.log(result);
                            $scope.model.device.plugins = result;
                            $scope.model.plugin = _.findWhere($scope.model.device.plugins, {name: newSubdevice.type});
                            $scope.model.schema = $scope.model.plugin.messageSchema;
                        })

                } else {
                    $scope.model.plugin = plugin;
                    $scope.model.schema = $scope.model.plugin.messageSchema;
                }
            }
        });

        $scope.sendMessage = function () {
            /*
             if schema exists - get the value from the editor, validate the input and send the message if valid
             otherwise notify the user that there was an error.

             if no schema exists, they are doing this manually and we check if the UUID field is populated and that
             there is a message to send.
             */
            var sender = $scope.model.fromDevice;
            if ($scope.model.subdevice) {
                skynetService.sendMessage({
                    fromUuid: sender.uuid,
                    devices: $scope.model.sendUuid || $scope.model.device.uuid,
                    subdevice: $scope.model.subdevice.name,
                    payload: $scope.model.schemaEditor.getValue()
                }).then(function (response) {
                    $scope.model.messageOutput = $scope.model.schemaEditor.getValue();
                    $scope.model.messageResult = response;
                });
            } else {

                skynetService.sendMessage({
                    fromUuid: sender.uuid,
                    devices: $scope.model.sendUuid || $scope.model.device.uuid,
                    payload: $scope.model.schemaEditor.getValue()
                }).then(function (response) {
                    $scope.model.messageOutput = $scope.model.schemaEditor.getValue();
                    $scope.model.messageResult = response;
                });
            }
        }
    });