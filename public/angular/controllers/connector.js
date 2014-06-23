'use strict';

angular.module('octobluApp')
    .controller('smartDeviceController', function ($scope, myDevices, skynetService, currentUser) {
        $scope.sfForm = [
            '*',
            {
                type: 'submit',
                title: 'Save'
            }
        ];
        $scope.devices = _.filter(myDevices, function (device) {
            return device.type !== 'gateway';
        });

        $scope.saveDevice = function () {
            var updatedDevice = $scope.editingDevice;
            if (updatedDevice.uuid) {
                skynetService.updateDevice(updatedDevice).then(function (result) {
                    delete $scope.editingDevice;
                    console.log('made it');
                });
            } else {
                skynetService.registerDevice(updatedDevice).then(function (result) {
                    delete $scope.editingDevice;
                    console.log(result);
                    myDevices.push(result);
                    $scope.devices = _.filter(myDevices, function (device) {
                        return device.type !== 'gateway';
                    });
                });
            }
        };

        $scope.editDevice = function (device) {
            $scope.editingDevice = device;
        };

        $scope.newDevice = function () {
            $scope.editDevice({ owner: currentUser.skynetuuid, name: '' });
        };

        $scope.deleteDevice = function (device) {
            skynetService.unregisterDevice({ uuid: device.uuid})
                .then(function (result) {
                    $scope.devices = _.without($scope.devices, device);
                });

        };
    })
    .controller('hubController', function ($scope, $modal, myDevices,myGateways, skynetService, currentUser, PluginService, availableDeviceTypes) {

        $scope.claimedHubs = myGateways;
        $scope.availableDeviceTypes = availableDeviceTypes;

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

        $scope.addPlugin = function (hub) {

        };

        $scope.deletePlugin = function (hub, plugin) {
            PluginService.uninstallPlugin(hub, plugin.name)
                .then(function (result) {
                    console.log(result);
                    hub.plugins = _.without(hub.plugins, plugin);
                });

        };
    })
    .controller('MessagingController', function($scope, currentUser, myDevices, myGateways, skynetService, PluginService){
        $scope.devices = _.sortBy(_.clone(myDevices), 'name');
        $scope.devices.unshift({
            name : 'Me',
            uuid : currentUser.skynetuuuid,
            token : currentUser.skynettoken,
            type : 'user'
        });

        $scope.schemaEditor = {};
        $scope.msg;

        skynetService.getMessage(function(channel, message){
            alert(JSON.stringify(message, null, true));
        });

        $scope.$watch('sendUuid', function(newValue, oldValue){
            if(newValue || $scope.device){
                $scope.schema = {};
            } else {
                delete $scope.schema;
            }
        });

        $scope.$watch('device', function(newDevice, oldDevice){

            if(newDevice || $scope.sendUuid ){
                if(newDevice.type !== 'gateway'){
                    $scope.schema = {};
                }
            } else {
                delete $scope.schema;
            }
        });

        $scope.$watch('subdevice', function(newSubdevice, oldSubdevice){

            if(newSubdevice){
               var plugin = _.findWhere($scope.device.plugins, {name : newSubdevice.type});
               if(! plugin ){
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

        $scope.sendMessage = function(){
            /*
             if schema exists - get the value from the editor, validate the input and send the message if valid
             otherwise notify the user that there was an error.

             if no schema exists, they are doing this manually and we check if the UUID field is populated and that
             there is a message to send.
             */
            var sender = $scope.fromDevice || { uuid : currentUser.skynetuuid, token : currentUser.skynettoken};
            if( $scope.subdevice ){
                skynetService.sendMessage({
                   fromUuid : sender.uuid,
                     devices : $scope.sendUuid || $scope.device.uuid ,
                     subdevice : $scope.subdevice.name,
                     payload: $scope.schemaEditor.getValue()
                }).then(function(result){
                    $scope.messageOutput = $scope.schemaEditor.getValue();
                });
            } else {

                skynetService.sendMessage({
                    fromUuid : sender.uuid,
                    devices : $scope.sendUuid || $scope.device.uuid,
                    payload: $scope.schemaEditor.getValue()
                }).then(function(result){
                      $scope.messageOutput = $scope.schemaEditor.getValue();
                });
            }



//            var message = $scope.message;
//
//            if($scope.fromDevice){
//                var fromDeviceUuid = $scope.fromDevice.uuid;
//                var fromDeviceToken = $scope.fromDevice.token
//            } else {
//                var fromDeviceUuid = $cookies.skynetuuid
//                var fromDeviceToken = $cookies.skynettoken
//            }
//
//            if($scope.sendUuid === undefined || $scope.sendUuid == ""){
//                if($scope.device){
//                    var uuid = $scope.device.uuid;
//                } else {
//                    var uuid = "";
//                }
//            } else {
//                var uuid = $scope.sendUuid;
//            }
//
//            if(uuid){
//
//                if($scope.schema){
//                    var errors = $('#device-msg-editor').jsoneditor('validate');
//                    if(errors.length){
//                        alert(errors);
//                    } else{
//                        // if ($scope.sendText != ""){
//                        //   message = $scope.sendText;
//                        //   if(typeof message == "string"){
//                        //     message = JSON.parse($scope.sendText);
//                        //   }
//                        // } else {
//                        message = $('#device-msg-editor').jsoneditor('value');
//                        console.log('schema message', message);
//                        // }
//
//                        $scope.subdevicename = $scope.subdevice.name;
//                    }
//
//                } else{
//                    message = $scope.sendText;
//                    try{
//                        if(typeof message == "string"){
//                            message = JSON.parse($scope.sendText);
//                        }
//                        // message = message.message;
//                        $scope.subdevicename = message.subdevice;
//                        delete message["subdevice"];
//
//                    } catch(e){
//                        message = $scope.sendText;
//                        $scope.subdevicename = "";
//                    }
//
//                }
//
//                var newMessage = {};
//                newMessage.subdevice = $scope.subdevicename;
//                newMessage.payload = message;
//
//                // socket.emit('message', {
//                //     "devices": uuid,
//                //     "subdevice": $scope.subdevicename,
//                //     "payload": message
//                // }, function(data){
//                //     console.log(data);
//                // });
//
//                messageService.sendMessage(fromDeviceUuid, fromDeviceToken, uuid, newMessage, function(data) {
//
//                    $scope.messageOutput = "Message Sent: " + JSON.stringify(data);
//
//                });
//
//                // $scope.messageOutput = "Message Sent: " + JSON.stringify(message);
//
//            }
        }



    })
    .controller('connectorController', function (currentUser, skynetService, $scope, $http, $injector, $location, $modal, $log, $q, $state, ownerService, deviceService, channelService, myDevices) {
        $scope.skynetStatus = false;
        $scope.channelList = [];
        $scope.predicate = 'name';

        var devices = _.filter(myDevices, function (device) {
            return device.type !== 'gateway';
        });

        $scope.gateways = _.difference(myDevices, devices);
        $scope.devices = devices;

        _.each($scope.gateways, function (gateway) {
            skynetService.gatewayConfig({
                "uuid": gateway.uuid,
                "token": gateway.token,
                "method": "configurationDetails"
            }).then(function (response) {
                gateway.subdevices = response.result.subdevices || [];
                gateway.plugins = response.result.plugins || [];
            });
        });

        $scope.navType = 'pills';


        // get api list, if showing api
        if ($state.is('connector.channels.index')) {
            channelService.getActive($scope.skynetuuid, function (data) {
                $scope.activeChannels = data;
            });
            channelService.getAvailable($scope.skynetuuid, function (error, data) {
                $scope.availableChannels = data;
            });
        }


        $scope.openDetails = function (channel) {
            // $scope.channel = channel;
            $state.go('connector.channels.detail', { name: channel.name });
        };

        $scope.isActive = function (channel) {
            if (currentUser.api) {
                for (var l = 0; l < currentUser.api.length; l++) {
                    if (currentUser.api[l].name === channel.name) {
                        return true;
                    }
                }
            }

            return false;
        };

        $scope.isInactive = function (channel) {
            if (currentUser.api) {
                for (var l = 0; l < currentUser.api.length; l++) {
                    if (currentUser.api[l].name === channel.name) {
                        return false;
                    }
                }
            }

            return true;
        };

        $scope.getFAName = function (channel) {
            var prefix = 'fa-';
            var name = channel.name.toLowerCase();
            if (name === 'stackoverflow') {
                return prefix + 'stack-overflow';
            }
            if (name === 'vimeo') {
                return prefix + 'vimeo-square';
            }
            if (name === 'tumblr') {
                return prefix + 'tumblr-square';
            }
            if (name === 'fitbit') {
                return prefix + 'square';
            }
            if (name === 'twilio') {
                return prefix + 'square';
            }
            if (name === 'tropo') {
                return prefix + 'square';
            }
            if (name === 'rdio') {
                return prefix + 'square';
            }
            if (name === 'newyorktimes') {
                return prefix + 'square';
            }
            if (name === 'musixmatch') {
                return prefix + 'square';
            }
            if (name === 'lastfm') {
                return prefix + 'square';
            }
            if (name === 'etsy') {
                return prefix + 'square';
            }
            if (name === 'spotify') {
                return prefix + 'square';
            }
            if (name === 'delicious') {
                return prefix + 'square';
            }
            if (name === 'bitly') {
                return prefix + 'square';
            }
            if (name === 'readability') {
                return prefix + 'square';
            }
            return prefix + name;
        };

        $scope.alert = function (alertContent) {
            alert(JSON.stringify(alertContent));
        };

        // $scope.addDevice = function(){
        //   $scope.deviceName = "";l
        //   $scope.keys = [];
        // }

        $scope.createDevice = function ($scope) {
            if ($scope.deviceName) {
                // var dupeFound = false;
                // $scope.duplicateDevice = false;
                var dupeUuid, dupeToken, dupeIndex;

                for (var i in $scope.devices) {
                    if ($scope.devices[i].name == $scope.deviceName) {
                        // dupeFound = true;
                        // $scope.duplicateDevice = true;
                        dupeUuid = $scope.devices[i].uuid;
                        dupeToken = $scope.devices[i].token;
                        dupeIndex = i;
                    }
                }

                var formData = {};
                formData.name = $scope.deviceName;
                formData.keyvals = $scope.keys;

                if (dupeUuid) {
                    formData.uuid = dupeUuid;
                    formData.token = dupeToken;

                    deviceService.updateDevice($scope.skynetuuid, formData, function (data) {
                        try {
                            $scope.devices.splice(dupeIndex, 1);
                            data.token = dupeToken;
                            data.online = false;
                            $scope.devices.push(data);
                            $scope.deviceName = "";
                            $scope.keys = [
                                {}
                            ];
                        } catch (e) {
                            $scope.devices = [data];
                        }
                        $scope.addDevice = false;
                    });

                } else {
                    deviceService.createDevice($scope.skynetuuid, formData, function (data) {
                        try {
                            $scope.devices.push(data);
                            $scope.deviceName = "";
                            $scope.keys = [
                                {}
                            ];
                        } catch (e) {
                            $scope.devices = [data];
                        }
                        $scope.addDevice = false;
                    });

                }
            }

        };

        $scope.editDevice = function (idx) {
            $scope.addDevice = true;
            var device_to_edit = $scope.devices[idx];
            $scope.deviceName = device_to_edit.name;

            // find additional keys to edit
            var keys = [];
            for (var key in device_to_edit) {
                if (device_to_edit.hasOwnProperty(key)) {
                    if (key != "_id" && key != "name" && key != "online" && key != "owner" && key != "socketId" && key != "timestamp" && key != "uuid" && key != "token" && key != "$$hashKey" && key != "channel" && key != "eventCode") {
                        keys.push({"key": key, "value": device_to_edit[key]});
                    }
                }
            }
            if (keys.length) {
                $scope.keys = keys;
            } else {
                $scope.keys = [
                    {}
                ];
            }

        }

        $scope.deleteDevice = function (idx) {

            $scope.confirmModal($modal, $scope, $log, 'Delete Device', 'Are you sure you want to delete this device?',
                function () {
                    $log.info('ok clicked');
                    var device_to_delete = $scope.devices[idx];
                    console.log(device_to_delete);
                    deviceService.deleteDevice(device_to_delete.uuid, device_to_delete.token, function (data) {
                        $scope.devices.splice(idx, 1);
                    });
                },
                function () {
                    $log.info('cancel clicked');
                });

        };

        $scope.keys = [
            {key: '', value: ''}
        ];
        $scope.addKeyVals = function () {
            $scope.keys.push({key: '', value: ''});
        }
        $scope.removeKeyVals = function (idx) {
            // $scope.keys.push( {key:'', value:''} );
            $scope.keys.splice(idx, 1);
        }
        $scope.editGatewayCancel = function () {
            $scope.editGatewaySection = false;
        }

        $scope.editGateway = function (idx) {
            $scope.editGatewaySection = true;
            var gateway_to_edit = $scope.gateways[idx];
            $scope.gatewayName = gateway_to_edit.name;
            $scope.gatewayOwner = gateway_to_edit.owner;
            $scope.editGatewayUuid = gateway_to_edit.uuid;

            // find additional keys to edit
            var keys = [];
            for (var key in gateway_to_edit) {
                if (gateway_to_edit.hasOwnProperty(key)) {
                    if (key != "_id" && key != "name" && key != "online" && key != "owner" && key != "socketId" && key != "timestamp" && key != "uuid" && key != "token" && key != "$$hashKey" && key != "channel" && key != "eventCode") {
                        keys.push({"key": key, "value": gateway_to_edit[key]});
                    }
                }
            }
            if (keys.length) {
                $scope.keys = keys;
            } else {
                $scope.keys = [
                    {}
                ];
            }

        }

        $scope.updateGateway = function () {
            $scope.gatewayName = $('#gatewayName').val();
            var gatewayOwner = $('#gatewayOwner').val();

            if ($scope.gatewayName) {
                var dupeUuid, dupeToken, dupeIndex;

                for (var i in $scope.gateways) {
                    if ($scope.gateways[i].uuid == $scope.editGatewayUuid) {
                        dupeUuid = $scope.gateways[i].uuid;
                        dupeToken = $scope.gateways[i].token;
                        dupeIndex = i;
                    }
                }

                var formData = {};
                formData.owner = $scope.skynetuuid;
                formData.name = $scope.gatewayName;
                formData.keyvals = $scope.keys;

                formData.uuid = dupeUuid;
                formData.token = dupeToken;

                deviceService.updateDevice($scope.skynetuuid, formData, gatewayOwner, function (data) {
                    console.log(data);
                    try {
                        $scope.gateways.splice(dupeIndex, 1);
                        data.token = dupeToken;
                        $scope.gateways.push(data);
                        $scope.gatewayName = "";
                        $scope.keys = [
                            {}
                        ];
                    } catch (e) {
                        $scope.gateways = [data];
                    }
                    $scope.editGatewaySection = false;
                });
            } else {
                //$scope.editGatewayUuid
            }

        };

        $scope.deleteGateway = function (idx) {

            $scope.confirmModal($modal, $scope, $log, 'Delete Gateway', 'Are you sure you want to delete this gateway?',
                function () {
                    $log.info('ok clicked');
                    var gateway_to_delete = $scope.gateways[idx];
                    deviceService.deleteDevice(gateway_to_delete.uuid, { skynetuuid: $scope.skynetuuid, skynettoken: $scope.skynettoken }, function (error, data) {
                        if (!error) {
                            $scope.gateways.splice(idx, 1);
                        }
                    });
                },
                function () {
                    $log.info('cancel clicked');
                });

        };

        $scope.deleteSubdevice = function (parent, idx) {
            $scope.confirmModal($modal, $scope, $log, 'Delete Subdevice', 'Are you sure you want to delete this subdevice?',
                function () {
                    $log.info('ok clicked');
                    var subName = $scope.gateways[parent].subdevices[idx].name
                    $scope.gateways[parent].subdevices.splice(idx, 1)
                    skynetService.gatewayConfig({
                        "uuid": $scope.gateways[parent].uuid,
                        "token": $scope.gateways[parent].token,
                        "method": "deleteSubdevice",
                        "name": subName
                        // "name": $scope.gateways[parent].subdevices[idx].name
                    }).then(function (deleteResult) {
                        // alert(JSON.stringify(deleteResult));
                    });
                },
                function () {
                    $log.info('cancel clicked');
                });

        };

        $scope.addSubdevice = function (gateway, pluginName, subDeviceName, deviceProperties) {
            console.log('add device properties ', deviceProperties);
            skynetService.gatewayConfig({
                "uuid": gateway.uuid,
                "token": gateway.token,
                "method": "createSubdevice",
                "type": pluginName,
                "name": subDeviceName,
                "options": deviceProperties
            }).then(function (addResult) {
                console.log(addResult);
            });
        };

        $scope.updateSubdevice = function (gateway, pluginName, subDeviceName, deviceProperties) {
            console.log('updating device properties ', deviceProperties);
            skynetService.gatewayConfig({
                "uuid": gateway.uuid,
                "token": gateway.token,
                "method": "updateSubdevice",
                "type": pluginName,
                "name": subDeviceName,
                "options": deviceProperties
            }).then(function (updateResult) {
                console.log(updateResult);
            });
        };

        $scope.deletePlugin = function (parent, idx) {
            $scope.confirmModal($modal, $scope, $log, 'Delete Plugin', 'Are you sure you want to delete this plugin?',
                function () {
                    $log.info('ok clicked');
                    skynetService.gatewayConfig({
                        "uuid": $scope.gateways[parent].uuid,
                        "token": $scope.gateways[parent].token,
                        "method": "deletePlugin",
                        "name": $scope.gateways[parent].plugins[idx].name
                    }).then(function (deleteResult) {
                        alert('plugin deleted');
                    });
                },
                function () {
                    $log.info('cancel clicked');
                });

        };

        $scope.addPlugin = function (gateway, pluginName) {
            skynetService.gatewayConfig({
                "uuid": gateway.uuid,
                "token": gateway.token,
                "method": "installPlugin",
                "name": pluginName
            }).then(function (addResult) {
                // alert('plugin added');
                console.log(addResult);
            });
        };

        $scope.openNewPlugin = function (gateway) {
            console.log(gateway);
            $scope.selectedGateway = gateway;
            $http({
                url: "http://npmsearch.com/query",
                method: "get",
                params: {
                    q: 'keywords:"skynet-plugin"',
                    fields: 'name',
                    start: 0,
                    size: 100,
                    sort: 'rating:desc'
                }
            }).success(function (data, status, headers, config) {
                console.log('npm search success', data);
                $scope.plugins = data.results;

                var modalInstance = $modal.open({
                    templateUrl: 'pluginModal.html',
                    scope: $scope,
                    controller: function ($modalInstance) {
                        $scope.ok = function (plugin) {
                            $modalInstance.close({
                                "plugin": plugin.name
                            });
                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    }
                });
                modalInstance.result.then(function (response) {

                    $scope.plugin = response.plugin;
                    $scope.addPlugin($scope.selectedGateway, response.plugin);
                    if (!$scope.selectedGateway.plugins) $scope.selectedGateway.plugins = [];
                    $scope.selectedGateway.plugins.push({name: response.plugin})

                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });


            }).error(function (data, status, headers, config) {
                console.log('npm search failed', data);
                $scope.status = status;
                alert("Plugin search failed. Try again in a little while...")
            });

        };

        $scope.openNewSubdevice = function (gateway) {
            $scope.selectedGateway = gateway;

            var modalInstance = $modal.open({
                templateUrl: 'subDeviceModal.html',
                scope: $scope,
                controller: function ($modalInstance) {

                    $scope.gatewayName = $scope.selectedGateway.name;
                    $scope.plugins = $scope.selectedGateway.plugins;
                    $scope.ok = function (subDeviceName, plugin, deviceProperties) {

                        console.log(deviceProperties);
                        var properties = _.map(deviceProperties, function (deviceProperty) {
                            delete deviceProperty.$$hashKey;
                            delete deviceProperty.type;
                            delete deviceProperty.required;
                            return deviceProperty;
                        });

                        var options = {};
                        _.forEach(deviceProperties, function (property) {
                            options[property.name] = property.value;
                        });

                        $modalInstance.close({
                            "name": subDeviceName,
                            "plugin": plugin.name,
                            "deviceProperties": options
                        });
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };

                    $scope.getSchema = function (plugin) {
                        $log.info(plugin);
                        $scope.schema = plugin.optionsSchema;
                        var keys = _.keys($scope.schema.properties);

                        var propertyValues = _.values($scope.schema.properties);
                        console.log('propertyValues');
                        console.log(propertyValues);

                        var deviceProperties = _.map(keys, function (propertyKey) {
                            console.log(propertyKey);
                            var propertyValue = $scope.schema.properties[propertyKey];
                            console.log(propertyValue);
                            var deviceProperty = {};
                            deviceProperty.name = propertyKey;
                            deviceProperty.type = propertyValue.type;
                            deviceProperty.required = propertyValue.required;
                            deviceProperty.value = "";
                            return deviceProperty;
                        });
                        console.log(deviceProperties);
                        $scope.deviceProperties = deviceProperties;

                        // Get default options
                        skynetService.gatewayConfig({
                            "uuid": $scope.selectedGateway.uuid,
                            "token": $scope.selectedGateway.token,
                            "method": "getDefaultOptions",
                            "name": plugin.name
                        }).then(function (defaults) {
                            // TODO: defaults are not returning - factor into object
                            console.log('config:', defaults);
                            console.log($scope.deviceProperties);
                            _.each(defaults.result, function (value, key) {
                                for (var i in $scope.deviceProperties) {
                                    if ($scope.deviceProperties[i].name == key) {
                                        // $scope.deviceProperties[i].value = value;
                                        $scope.$apply(function () {
                                            $scope.deviceProperties[i].value = value;
                                        });
                                    }
                                }
                            });
                        });

                    };
                }
            });

            modalInstance.result.then(function (response) {
                console.log(response);
                $scope.subDeviceName = response.name;
                $scope.plugin = response.plugin;
                $scope.deviceProperties = response.deviceProperties;
                $scope.addSubdevice($scope.selectedGateway, response.plugin, response.name, response.deviceProperties);

                $scope.selectedGateway.subdevices.push({name: response.name, type: response.plugin, options: response.deviceProperties})

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

        };


        $scope.openEditSubdevice = function (gateway, subdevice) {
            console.log(subdevice);
            $scope.selectedGateway = gateway;
            $scope.selectedSubdevice = subdevice;
            for (var l = 0; l < $scope.selectedGateway.plugins.length; l++) {
                if ($scope.selectedGateway.plugins[l].name === subdevice.type) {
                    $scope.selectedPlugin = $scope.selectedGateway.plugins[l];
                    break;
                }
            }
            $scope._backup = angular.copy(subdevice);

            var modalInstance = $modal.open({
                templateUrl: 'editSubDeviceModal.html',
                scope: $scope,
                controller: function ($modalInstance) {
                    // $log.info($scope.selectedSubdevice);
                    $scope.gatewayName = $scope.selectedGateway.name;
                    $scope.plugins = $scope.selectedGateway.plugins;
                    console.log(subdevice.options);
                    var devicePairs = _.pairs(subdevice.options);
                    $scope.deviceProperties2 = _.map(devicePairs, function (devicePair) {
                        return {
                            "name": devicePair[0],
                            "type": 'string',
                            "required": true,
                            "value": devicePair[1]
                        }
                    });
                    console.log($scope.deviceProperties2);
                    $scope.ok = function (deviceProperties) {
                        $scope._backup = false;
                        console.log(deviceProperties);
                        var properties = _.map(deviceProperties, function (deviceProperty) {
                            delete deviceProperty.$$hashKey;
                            delete deviceProperty.type;
                            delete deviceProperty.required;
                            return deviceProperty;
                        });

                        var options = {};
                        _.forEach(deviceProperties, function (property) {
                            options[property.name] = property.value;
                        });
                        console.log('update', options);
                        $modalInstance.close({
                            "subDeviceName": $scope.selectedSubdevice.name,
                            "plugin": subdevice.type,
                            "deviceProperties": options
                        });
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };

                    $scope.getSchema = function (plugin) {
                        $scope.schema = plugin.optionsSchema;
                        // $log.info($scope.plugins);
                        var keys = _.keys($scope.schema.properties);
                        var propertyValues = _.values($scope.schema.properties);

                        var deviceProperties = _.map(keys, function (propertyKey) {
                            var propertyValue = $scope.schema.properties[propertyKey];
                            var deviceProperty = {};
                            deviceProperty.name = propertyKey;
                            deviceProperty.type = propertyValue.type;
                            deviceProperty.required = propertyValue.required;
                            deviceProperty.value = "";
                            return deviceProperty;
                        });
                        $scope.deviceProperties = deviceProperties;
                    };

                    $scope.getSchema($scope.selectedPlugin);
                }
            });

            modalInstance.result.then(function (response) {
                console.log(response);
                $scope.subDeviceName = response.subDeviceName;
                $scope.plugin = response.plugin;
                $scope.deviceProperties = response.deviceProperties;
                $scope.updateSubdevice($scope.selectedGateway, response.plugin, response.subDeviceName, response.deviceProperties);
                // TODO: update the subdevice, not push a new one
                // $scope.selectedGateway.subdevices.push({name: response.name, type: response.plugin, options: response.deviceProperties})

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
                if ($scope._backup) {
                    // $scope.selectedSubdevice.name = $scope._backup.name;
                    for (var l = 0; l <= $scope.selectedGateway.subdevices.length; l++) {
                        if ($scope.selectedGateway.subdevices[l] == $scope.selectedSubdevice) {
                            $log.info('found match');
                            $scope.selectedGateway.subdevices[l] = $scope._backup;
                        }
                    }
                }
            });

        }
    });
