'use strict';

angular.module('octobluApp')
    .controller('connectorController', function(skynetService, $scope, $http, $injector, $location, $modal, $log, $q, $state, ownerService, deviceService, channelService) {
        $scope.skynetStatus = false;
        $scope.channelList = [];
        $scope.predicate = 'name';

        $scope.checkLogin($scope, $http, $injector, true, function () {

            $scope.navType = 'pills';
                // Get user devices
                // Get user gateways (true param specifies inclusion of devices)

                $scope.openDetails = function (channel) {
                    // $scope.channel = channel;
                    $state.go('connector.channels.detail', { name: channel.name });
                };

                $scope.isActive = function (channel) {
                    return $scope.current_user.api &&
                        _.findWhere($scope.current_user.api, { name: channel.name});
                };

                $scope.isInactive = function (channel) {
                   !$scope.isActive(channel);
                };

                $scope.getFAName = function (channel) {
                    var prefix = 'fa-';
                    var name = channel.name.toLowerCase();
                    if(name==='stackoverflow') { return prefix+'stack-overflow'; }
                    if(name==='vimeo') { return prefix+'vimeo-square'; }
                    if(name==='tumblr') { return prefix+'tumblr-square'; }
                    if(name==='fitbit') { return prefix+'square'; }
                    if(name==='twilio') { return prefix+'square'; }
                    if(name==='tropo') { return prefix+'square'; }
                    if(name==='rdio') { return prefix+'square'; }
                    if(name==='newyorktimes') { return prefix+'square'; }
                    if(name==='musixmatch') { return prefix+'square'; }
                    if(name==='lastfm') { return prefix+'square'; }
                    if(name==='etsy') { return prefix+'square'; }
                    if(name==='spotify') { return prefix+'square'; }
                    if(name==='delicious') { return prefix+'square'; }
                    if(name==='bitly') { return prefix+'square'; }
                    if(name==='readability') { return prefix+'square'; }
                    return prefix + name;
                };

                $scope.alert = function(alertContent){
                    alert(JSON.stringify(alertContent));
                };

                $scope.keys = [{key:'', value:''}];
                var badKeys =  ['_id', 'name', 'online', 'owner', 'socketId', 'timestamp' , 'uuid' , 'token' , '$$hashKey' , 'channel' , 'eventCode'];

                $scope.addKeyVals = function() {
                    $scope.keys.push( {key:'', value:''} );
                };
                $scope.removeKeyVals = function(key) {
                   delete $scope.editingDevice[key];
                };

                $scope.deleteSubdevice = function(gateway, subdevice){
                    $scope.confirmModal($modal, $scope, $log, 'Delete Subdevice','Are you sure you want to delete this subdevice?',
                        function() {
                            gateway.subdevices = _.without(gateway.subdevices, subdevice);
                            skynetService.gatewayConfig({
                                "uuid": gateway.uuid,
                                "token": gateway.token,
                                "method": "deleteSubdevice",
                                "name": subdevice.name
                            });
                        });
                };

                $scope.addSubdevice = function(gateway, pluginName, subDeviceName, deviceProperties){
                    console.log('add device properties ', deviceProperties);
                    skynetService.gatewayConfig( {
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

                $scope.updateSubdevice = function(gateway, pluginName, subDeviceName, deviceProperties){
                  console.log('updating device properties ', deviceProperties);
                    skynetService.gatewayConfig( {
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

                $scope.deletePlugin = function(gateway, plugin){
                    $scope.confirmModal($modal, $scope, $log, 'Delete Plugin','Are you sure you want to delete this plugin?',
                        function() {
                            $log.info('ok clicked');
                            skynetService.gatewayConfig({
                                "uuid": gateway.uuid,
                                "token": gateway.token,
                                "method": "deletePlugin",
                                "name": plugin.name
                            }).then(function (deleteResult) {
                                alert('plugin deleted');
                            });
                        },
                        function() {
                            $log.info('cancel clicked');
                        });
                };

                $scope.openNewPlugin = function (gateway) {
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
                    }).success(function(data) {
                        console.log('npm search success',data);
                        var modalInstance = $modal.open({
                            templateUrl: 'pluginModal.html',
                            controller: function ($scope, $modalInstance) {
                                $scope.gateway = gateway;
                                $scope.ok = function (plugin) {
                                    $modalInstance.close({
                                        "plugin" : plugin.name
                                    });
                                };
                                $scope.cancel = function () {
                                    $modalInstance.dismiss('cancel');
                                };
                            }
                        });

                        modalInstance.result.then(function (response) {
                            skynetService.gatewayConfig( {
                                "uuid": gateway.uuid,
                                "token": gateway.token,
                                "method": "installPlugin",
                                "name": pluginName
                            }).then(function (addResult) {
                                console.log(addResult);
                            });

                            gateway.plugins = gateway.plugins || [];
                            gateway.plugins.push({name: response.plugin});

                        }, function (){
                            $log.info('Modal dismissed at: ' + new Date());
                        });

                    }).error(function(data, status) {
                        console.log('npm search failed',data);
                        $scope.status = status;
                        alert("Plugin search failed. Try again in a little while...")
                    });
                };

                $scope.openNewSubdevice = function (gateway) {
                    $scope.gateway = gateway;

                    var modalInstance = $modal.open({
                        templateUrl: 'subDeviceModal.html',
                        controller: function ($modalInstance) {
                            $scope.gatewayName = $scope.gateway.name;
                            $scope.plugins = $scope.gateway.plugins;
                            $scope.ok = function (subDeviceName, plugin, deviceProperties) {
                                console.log(deviceProperties);
                                var options = angular.copy(_.omit(deviceProperties, ['$$hashKey', 'type', 'required']));
                                $modalInstance.close({
                                    "name" : subDeviceName,
                                    "plugin" : plugin.name,
                                    "deviceProperties" : options
                                });
                            };

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };

                            $scope.getSchema = function (plugin){
                                $log.info(plugin);
                                $scope.schema = plugin.optionsSchema;
                                var keys = _.keys($scope.schema.properties);

                                var propertyValues = _.values($scope.schema.properties);
                                console.log('propertyValues');
                                console.log(propertyValues);

                                var deviceProperties = _.map(keys, function(propertyKey){
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
                                skynetService.gatewayConfig( {
                                    "uuid": $scope.gateway.uuid,
                                    "token": $scope.gateway.token,
                                    "method": "getDefaultOptions",
                                    "name": plugin.name
                                }).then(function (defaults) {
                                    // TODO: defaults are not returning - factor into object
                                    console.log('config:', defaults);
                                    console.log($scope.deviceProperties);
                                });
                            };
                        }
                    });

                    modalInstance.result.then(function (response) {
                        console.log(response);
                        $scope.subDeviceName = response.name;
                        $scope.plugin = response.plugin;
                        $scope.deviceProperties = response.deviceProperties;
                        $scope.addSubdevice($scope.gateway, response.plugin, response.name, response.deviceProperties);

                        $scope.gateway.subdevices.push({name: response.name, type: response.plugin, options: response.deviceProperties})

                    }, function (){
                        $log.info('Modal dismissed at: ' + new Date());
                    });

                };

                $scope.openEditSubdevice = function (gateway, subdevice) {
                    $scope.gateway = gateway;

                    var plugin = _.findWhere(gateway.plugins, function(plugin){
                        return plugin.name === subdevice.type;
                    });

                    $scope._backup = angular.copy(subdevice);

                    var modalInstance = $modal.open({
                        templateUrl: 'editSubDeviceModal.html',
                        controller: function ($modalInstance) {
                            var devicePairs = _.pairs(subdevice.options);
                            $scope.deviceProperties2 = _.map(devicePairs, function(devicePair){
                              return {
                                "name" : devicePair[0],
                                 "type" : 'string',
                                 "required": true,
                                 "value" : devicePair[1]
                              }
                            });
                            $scope.ok = function (deviceProperties) {
                                $scope._backup = false;

                                var properties = _.indexBy(
                                    _.map(deviceProperties, function(deviceProperty){
                                    return _.omit(deviceProperty, '$$hashKey', 'type', 'required');
                                }), 'name');

                                var options = {};
                                _.forEach(properties, function(property){
                                    options[property.name] = property.value;
                                });

                                console.log('update', options);
                                $modalInstance.close({
                                    "subDeviceName" : $scope.subdevice.name,
                                    "plugin" : subdevice.type,
                                    "deviceProperties" : options
                                });
                            };

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };

                            $scope.getSchema = function (plugin){
                                $scope.schema = plugin.optionsSchema;
                                // $log.info($scope.plugins);
                                var keys = _.keys($scope.schema.properties);
                                var propertyValues = _.values($scope.schema.properties);

                                var deviceProperties = _.map(keys, function(propertyKey){
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

                            $scope.getSchema(plugin);
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

                    }, function (){
                        $log.info('Modal dismissed at: ' + new Date());
                        if($scope._backup) {
                            // $scope.selectedSubdevice.name = $scope._backup.name;
                            for(var l=0; l<=$scope.selectedGateway.subdevices.length; l++) {
                                if($scope.selectedGateway.subdevices[l] == $scope.selectedSubdevice) {
                                    $log.info('found match');
                                    $scope.selectedGateway.subdevices[l] = $scope._backup;
                                }
                            }
                        }
                    });
                }
        });
    })
    .controller('deviceController', function($scope, ownerService){
        ownerService.getDevices($scope.skynetuuid, $scope.skynettoken, function(data) {
            $scope.devices = _.filter(data, function(device){
                return device.type !== 'gateway';
            });
        });
        $scope.createDevice = function (device) {
            if($scope.editingDevice){
                var dupeDevice = _.findWhere($scope.devices, {uuid: device.uuid});
                var formData = {
                    name: $scope.deviceName,
                    keyvals: $scope.keys
                };

                if(dupeDevice){
                    formData.uuid = dupeDevice.uuid;
                    formData.token = dupeDevice.token;

                    deviceService.updateDevice($scope.skynetuuid, formData, function(data) {
                        try{
                            $scope.devices = _.without($scope.devices, dupeDevice);
                            data.token = dupeDevice.token;
                            data.online = false;
                            $scope.devices.push(data);
                            $scope.deviceName = "";
                            $scope.keys = [{}];
                        } catch(e){
                            $scope.devices = [data];
                        }
                        $scope.addDevice = false;
                    });

                } else {
                    deviceService.createDevice($scope.skynetuuid, formData, function(data) {
                        try{
                            $scope.devices.push(data);
                            $scope.deviceName = "";
                            $scope.keys = [{}];
                        } catch(e){
                            $scope.devices = [data];
                        }
                        delete $scope.editingDevice;
                    });
                }
            }
        };

        $scope.deleteDevice = function( device_to_delete ){
            $scope.confirmModal($modal, $scope, $log, 'Delete Device','Are you sure you want to delete this device?',
                function() {
                    deviceService.deleteDevice(device_to_delete.uuid, device_to_delete.token, function(data) {
                        $scope.devices = _.without($scope.devices, device_to_delete);
                    });
                },
                function() {
                    $log.info('cancel clicked');
                });
        };
    })
    .controller('gatewayController', function($scope){

        $scope.editGatewayCancel = function() {
            $scope.editGatewaySection = false;
        };

        $scope.editGateway = function(gateway){
            $scope.editGatewaySection = true;
            $scope.gatewayName = gateway.name;
            $scope.gatewayOwner = gateway.owner;
            $scope.editGatewayUuid = gateway.uuid;

            // find additional keys to edit
            var keys = _.omit(gateway, badKeys);

            if(keys.length){
                $scope.keys = keys;
            } else {
                $scope.keys = [{}];
            }
        };

        $scope.updateGateway = function(){
            $scope.gatewayName = $('#gatewayName').val();
            var gatewayOwner = $('#gatewayOwner').val();

            if($scope.gatewayName){
                var dupeGateway = _.findWhere($scope.gateways, {name: $scope.gatewayName});
                var formData = {
                    owner: $scope.skynetuuid,
                    name: $scope.gatewayName,
                    keyVals : $scope.keys,
                    uuid: dupeGateway.uuid,
                    token: dupeGateway.token
                };

                deviceService.updateDevice($scope.skynetuuid, formData, gatewayOwner, function(data) {
                    console.log(data);
                    try{
                        $scope.gateways = _.without($scope.gateways, dupeGateway);
                        data.token = dupeGateway.token;
                        $scope.gateways.push(data);
                        $scope.gatewayName = "";
                        $scope.keys = [{}];
                    } catch(e){
                        $scope.gateways = [data];
                    }
                    $scope.editGatewaySection = false;
                });
            }
        };

        $scope.deleteGateway = function(gateway){
            $scope.confirmModal($modal, $scope, $log, 'Delete Gateway','Are you sure you want to delete this gateway?',
                function() {
                    deviceService.deleteDevice(gateway.uuid,
                        { skynetuuid: $scope.skynetuuid, skynettoken : $scope.skynettoken }, function(error, data) {
                            if( ! error ){
                                $scope.gateways = _.without($scope.gateways, gateway);
                            }
                        });
                },
                function() {
                });
        };
    })
    .controller('channelController', function($scope, channelService){
            channelService.getActive($scope.skynetuuid,function(data) {
                $scope.activeChannels = data;
            });
            channelService.getAvailable($scope.skynetuuid,function(error, data) {
                $scope.availableChannels = data;
            });
    });
