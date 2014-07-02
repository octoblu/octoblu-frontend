'use strict';

angular.module('octobluApp')
    .controller('MessagingController', function ($scope, currentUser, myDevices, myGateways, skynetService, PluginService) {
        $scope.devices = _.sortBy(_.clone(myDevices), 'name');
        $scope.devices.unshift({
            name: 'Me',
            uuid: currentUser.skynetuuid,
            token: currentUser.skynettoken,
            type: 'user'
        });

        $scope.schemaEditor = {};
        $scope.$on('skynet:message:' + currentUser.skynetuuid, function (channel, message) {
            alert(JSON.stringify(message, null, true));
        });

        $scope.$watch('sendUuid', function (newValue, oldValue) {
            if (newValue || $scope.device) {
                $scope.schema = {};
            } else {
                delete $scope.schema;
            }
        });

        $scope.$watch('device', function (newDevice, oldDevice) {
            $scope.subdevice = null;
            if (newDevice || $scope.sendUuid) {
                if (newDevice.type !== 'gateway') {
                    $scope.schema = {};
                }
            } else {
                delete $scope.schema;
            }
        });

        $scope.$watch('subdevice', function (newSubdevice, oldSubdevice) {
            if (newSubdevice) {
                var plugin = _.findWhere($scope.device.plugins, {name: newSubdevice.type});
                if (!plugin) {
                    PluginService.installPlugin($scope.device, newSubdevice.type)
                        .then(function (result) {
                            return PluginService.getInstalledPlugins($scope.device);
                        })
                        .then(function (result) {
                            console.log(result);
                            $scope.device.plugins = result.result;
                            $scope.plugin = _.findWhere($scope.device.plugins, {name: newSubdevice.type});
                            $scope.schema = $scope.plugin.messageSchema;
                        })

                } else {
                    $scope.plugin = plugin;
                    $scope.schema = $scope.plugin.messageSchema;
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
            var sender = $scope.fromDevice;
            if ($scope.subdevice) {
                skynetService.sendMessage({
                    fromUuid: sender.uuid,
                    devices: $scope.sendUuid || $scope.device.uuid,
                    subdevice: $scope.subdevice.name,
                    payload: $scope.schemaEditor.getValue()
                }).then(function (result) {
                    $scope.messageOutput = $scope.schemaEditor.getValue();
                });
            } else {

                skynetService.sendMessage({
                    fromUuid: sender.uuid,
                    devices: $scope.sendUuid || $scope.device.uuid,
                    payload: $scope.schemaEditor.getValue()
                }).then(function (result) {
                    $scope.messageOutput = $scope.schemaEditor.getValue();
                });
            }
        }
    });