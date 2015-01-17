'use strict';

angular.module('octobluApp')
    .controller('MessagingController', function($scope, currentUser, myDevices, myGateways, availableNodeTypes,
        skynetService, deviceService, PluginService) {

        $scope.model = {
            devices: _.sortBy(_.cloneDeep(myDevices), 'name'),
            nodeTypes: availableNodeTypes,
            schemaEditor: {}

        };


        $scope.model.devices.unshift({
            name: 'Me',
            uuid: currentUser.skynet.uuid,
            token: currentUser.skynet.token,
            type: 'user'
        });


        $scope.$watch('model.sendUuid', function(newValue, oldValue) {
            if (newValue || $scope.model.device) {
                $scope.model.schema = {};
            } else {
                delete $scope.model.schema;
            }
        });

        $scope.$watch('model.device', function(newDevice, oldDevice) {
            $scope.model.subdevice = null;
            if (newDevice || $scope.model.sendUuid) {
                if (newDevice.type !== 'gateway') {
                    $scope.model.schema = {};
                } else {
                    deviceService.gatewayConfig({
                        uuid: newDevice.uuid,
                        token: newDevice.token,
                        method: "configurationDetails"
                    }).then(function(response) {
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

        $scope.$watch('model.subdevice', function(newSubdevice, oldSubdevice) {
            if (newSubdevice) {
                var plugin = _.findWhere($scope.model.device.plugins, {
                    name: newSubdevice.type
                });
                if (!plugin) {
                    PluginService.installPlugin($scope.model.device, newSubdevice.type)
                        .then(function(result) {
                            return PluginService.getInstalledPlugins($scope.model.device);
                        })
                        .then(function(result) {
                            $scope.model.device.plugins = result;
                            $scope.model.plugin = _.findWhere($scope.model.device.plugins, {
                                name: newSubdevice.type
                            });
                            $scope.model.schema = $scope.model.plugin.messageSchema;
                        })

                } else {
                    $scope.model.plugin = plugin;
                    $scope.model.schema = $scope.model.plugin.messageSchema;
                }
            }
        });

        $scope.sendMessage = function() {
            /*
             if schema exists - get the value from the editor, validate the input and send the message if valid
             otherwise notify the user that there was an error.

             if no schema exists, they are doing this manually and we check if the UUID field is populated and that
             there is a message to send.
           */

            $scope.model.messageResult = "";
            $scope.messageResponseTime = "";
            $scope.startTimer = new Date().getTime();

            var sender = $scope.model.fromDevice;

            $scope.sendTimer = new Date().getTime();
            var difference = $scope.sendTimer - $scope.startTimer;

            $scope.model.messageOutput = $scope.model.schemaEditor.getValue();
            $scope.messageRequestTime = 'Sent in ' + difference + ' milliseconds';

            if ($scope.model.subdevice) {
                skynetService.sendMessage({
                    // fromUuid: sender.uuid,
                    fromUuid: currentUser.skynet.uuid,
                    devices: $scope.model.sendUuid || $scope.model.device.uuid,
                    subdevice: $scope.model.subdevice.uuid || $scope.model.subdevice.name,
                    payload: $scope.model.schemaEditor.getValue()
                }).then(function(response) {
                    if (!response.error) {
                        $scope.responseTimer = new Date().getTime();
                        var difference = $scope.responseTimer - $scope.startTimer;
                        $scope.messageResponseTime = 'Responded in ' + difference + ' milliseconds';

                        $scope.model.messageResult = response;
                    }
                });
            } else {
                skynetService.sendMessage({
                    // fromUuid: sender.uuid,
                    fromUuid: currentUser.skynet.uuid,
                    devices: $scope.model.sendUuid || $scope.model.device.uuid,
                    payload: $scope.model.schemaEditor.getValue()
                }).then(function(response) {
                    if (!response.error) {
                        $scope.responseTimer = new Date().getTime();
                        var difference = $scope.responseTimer - $scope.startTimer;
                        $scope.messageResponseTime = 'Responded in ' + difference + ' milliseconds';

                        $scope.model.messageResult = response;
                    }
                });
            }
        }
    });
