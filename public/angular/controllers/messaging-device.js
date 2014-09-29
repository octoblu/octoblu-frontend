'use strict';
angular.module('octobluApp')
    .controller('MessagingDeviceController', function ($scope, AuthService,  deviceService, skynetService, PluginService) {

        $scope.messageDevice = {
            recipientDevices : [_.clone($scope.device)],
            recipientDevice : _.clone($scope.device),
            schemaEditor :{}
        };

        deviceService.getDevices().then(function(devices){
            $scope.messageDevice.senderDevices = _.sortBy(_.cloneDeep(devices),'name');
        });

        $scope.$watch('messageDevice.recipientDevice', function (newDevice, oldDevice) {
            $scope.messageDevice.subdevice = null;
            if (newDevice) {
                if (newDevice.type !== 'gateway') {
                    $scope.messageDevice.schema = {};
                } else {
                    deviceService.gatewayConfig({
                        uuid: newDevice.uuid,
                        token: newDevice.token,
                        method: "configurationDetails"
                    }).then(function (response) {
                        if (response && response.result) {
                            $scope.messageDevice.recipientDevice.subdevices = response.result.subdevices || [];
                            $scope.messageDevice.recipientDevice.plugins = response.result.plugins || [];
                        }
                    });
                }
            } else {
                delete $scope.messageDevice.schema;
            }
        });

        $scope.$watch('messageDevice.subdevice', function (newSubdevice, oldSubdevice) {
            if (newSubdevice) {
                var plugin = _.findWhere($scope.messageDevice.recipientDevice.plugins, {name: newSubdevice.type});
                if (!plugin) {
                    PluginService.installPlugin($scope.messageDevice.recipientDevice, newSubdevice.type)
                        .then(function (result) {
                            return PluginService.getInstalledPlugins($scope.messageDevice.recipientDevice);
                        })
                        .then(function (result) {
                            $scope.messageDevice.recipientDevice.plugins = result;
                            $scope.messageDevice.plugin = _.findWhere($scope.messageDevice.recipientDevice.plugins, {name: newSubdevice.type});
                            $scope.messageDevice.schema = $scope.messageDevice.plugin.messageSchema;
                        })

                } else {
                    $scope.messageDevice.plugin = plugin;
                    $scope.messageDevice.schema = $scope.messageDevice.plugin.messageSchema;
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

            $scope.messageDevice.messageResult = "";
            $scope.messageResponseTime = "";
            $scope.startTimer = new Date().getTime();

            var sender = $scope.messageDevice.senderDevice;

            $scope.sendTimer = new Date().getTime();
            var difference = $scope.sendTimer - $scope.startTimer;

            $scope.messageDevice.messageOutput = $scope.messageDevice.schemaEditor.getValue();
            $scope.messageRequestTime = 'Sent in ' + difference + ' milliseconds';

            if ($scope.messageDevice.subdevice) {
                skynetService.sendMessage({
                    fromUuid: sender.uuid,
                    devices: $scope.messageDevice.recipientDevice.uuid,
                    subdevice: $scope.messageDevice.subdevice.uuid || $scope.messageDevice.subdevice.name,
                    payload: $scope.messageDevice.schemaEditor.getValue()
                }).then(function (response) {
                    if(!response.error){
                        $scope.responseTimer = new Date().getTime();
                        var difference = $scope.responseTimer - $scope.startTimer;
                        $scope.messageResponseTime = 'Responded in ' + difference + ' milliseconds';

                        $scope.messageDevice.messageResult = response;
                    }
                });
            } else {
                skynetService.sendMessage({
                    fromUuid: sender.uuid,
                    devices: $scope.messageDevice.recipientDevice.uuid,
                    payload: $scope.messageDevice.schemaEditor.getValue()
                }).then(function (response) {
                    if(!response.error){
                        $scope.responseTimer = new Date().getTime();
                        var difference = $scope.responseTimer - $scope.startTimer;
                        $scope.messageResponseTime = 'Responded in ' + difference + ' milliseconds';

                        $scope.messageDevice.messageResult = response;
                    }
                });
            }
        }
    });
