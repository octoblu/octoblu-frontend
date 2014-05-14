'use strict';

angular.module('octobluApp')
    .controller('connectorController', function($rootScope, $scope, $http, $injector, $location, $modal, $log, $q, $state,ownerService, deviceService, channelService) {
        $scope.skynetStatus = false;
        $scope.channelList = [];
        $scope.predicate = 'name';

        $rootScope.checkLogin($scope, $http, $injector, true, function () {

            $scope.navType = 'pills';
            // $scope.navType = 'tabs';

            // connect to skynet
            var skynetConfig = {
                'host': 'skynet.im',
                'port':80,
                "uuid": $scope.skynetuuid,
                "token": $scope.skynettoken
            }
            skynet(skynetConfig, function (e, socket) {
                if (e) throw e


                // Get user devices
                ownerService.getDevices($scope.skynetuuid, $scope.skynettoken, function(data) {
                    $scope.devices = data.devices;
                    for (var i in $scope.devices) {
                        if($scope.devices[i].type == 'gateway'){
                            $scope.devices.splice(i,1);
                        }
                    }
                });

                // Get user gateways (true param specifies inclusion of devices)
                ownerService.getGateways($scope.skynetuuid, $scope.skynettoken, false, function(error, data) {
                    if(error){
                        console.log('Error'  + error);
                    }
                    $scope.editGatewaySection = false;
                    $scope.gateways = data.gateways;
                });

                // get api list, if showing api
                if($state.is('connector.channels.index')) {
                    channelService.getActive($scope.skynetuuid,function(data) {
                        $scope.activeChannels = data;
                    });
                    channelService.getAvailable($scope.skynetuuid,function(error, data) {
                        $scope.availableChannels = data;
                    });
                }


                $scope.openDetails = function (channel) {
                    // $scope.channel = channel;
                    $state.go('connector.channels.detail', { name: channel.name });
                };

                $scope.isActive = function (channel) {
                    if($scope.current_user.api) {
                        for(var l = 0; l<$scope.current_user.api.length; l++) {
                            if($scope.current_user.api[l].name===channel.name) {
                                return true;
                            }
                        }
                    }

                    return false;
                };

                $scope.isInactive = function (channel) {
                    if($scope.current_user.api) {
                        for(var l = 0; l<$scope.current_user.api.length; l++) {
                            if($scope.current_user.api[l].name===channel.name) {
                                return false;
                            }
                        }
                    }

                    return true;
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

                // $scope.addDevice = function(){
                //   $scope.deviceName = "";l
                //   $scope.keys = [];
                // }

                $scope.createDevice = function ($scope) {
                    if($scope.deviceName){
                        // var dupeFound = false;
                        // $scope.duplicateDevice = false;
                        var dupeUuid, dupeToken, dupeIndex;

                        for (var i in $scope.devices) {
                            if($scope.devices[i].name == $scope.deviceName){
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

                        if(dupeUuid){
                            formData.uuid = dupeUuid;
                            formData.token = dupeToken;

                            deviceService.updateDevice($scope.skynetuuid, formData, function(data) {
                                try{
                                    $scope.devices.splice(dupeIndex,1);
                                    data.token = dupeToken;
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
                                $scope.addDevice = false;
                            });

                        }
                    }

                };

                $scope.editDevice = function( idx ){
                    $scope.addDevice = true;
                    var device_to_edit = $scope.devices[idx];
                    $scope.deviceName = device_to_edit.name;

                    // find additional keys to edit
                    var keys = [];
                    for (var key in device_to_edit) {
                        if (device_to_edit.hasOwnProperty(key)) {
                            if(key != "_id" && key != "name" && key != "online" && key != "owner" && key != "socketId" && key != "timestamp" && key != "uuid" && key != "token" && key != "$$hashKey" && key != "channel" && key != "eventCode"){
                                keys.push({"key": key, "value": device_to_edit[key]});
                            }
                        }
                    }
                    if(keys.length){
                        $scope.keys = keys;
                    } else {
                        $scope.keys = [{}];
                    }

                }

                $scope.deleteDevice = function( idx ){

                    $rootScope.confirmModal($modal, $scope, $log, 'Delete Device','Are you sure you want to delete this device?',
                        function() {
                            $log.info('ok clicked');
                            var device_to_delete = $scope.devices[idx];
                            console.log(device_to_delete);
                            deviceService.deleteDevice(device_to_delete.uuid, device_to_delete.token, function(data) {
                                $scope.devices.splice(idx, 1);
                            });
                        },
                        function() {
                            $log.info('cancel clicked');
                        });

                };

                $scope.keys = [{key:'', value:''}];
                $scope.addKeyVals = function() {
                    $scope.keys.push( {key:'', value:''} );
                }
                $scope.removeKeyVals = function(idx) {
                    // $scope.keys.push( {key:'', value:''} );
                    $scope.keys.splice(idx,1);
                }
                $scope.editGatewayCancel = function() {
                    $scope.editGatewaySection = false;
                }

                $scope.editGateway = function( idx ){
                    $scope.editGatewaySection = true;
                    var gateway_to_edit = $scope.gateways[idx];
                    $scope.gatewayName = gateway_to_edit.name;
                    $scope.editGatewayUuid = gateway_to_edit.uuid;

                    // find additional keys to edit
                    var keys = [];
                    for (var key in gateway_to_edit) {
                        if (gateway_to_edit.hasOwnProperty(key)) {
                            if(key != "_id" && key != "name" && key != "online" && key != "owner" && key != "socketId" && key != "timestamp" && key != "uuid" && key != "token" && key != "$$hashKey" && key != "channel" && key != "eventCode"){
                                keys.push({"key": key, "value": gateway_to_edit[key]});
                            }
                        }
                    }
                    if(keys.length){
                        $scope.keys = keys;
                    } else {
                        $scope.keys = [{}];
                    }

                }

                $scope.updateGateway = function(){
                    $scope.gatewayName = $('#gatewayName').val();

                    if($scope.gatewayName){
                        var dupeUuid, dupeToken, dupeIndex;

                        for (var i in $scope.gateways) {
                            if($scope.gateways[i].uuid == $scope.editGatewayUuid){
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

                        deviceService.updateDevice($scope.skynetuuid, formData, function(data) {
                            console.log(data);
                            try{
                                $scope.gateways.splice(dupeIndex,1);
                                data.token = dupeToken;
                                $scope.gateways.push(data);
                                $scope.gatewayName = "";
                                $scope.keys = [{}];
                            } catch(e){
                                $scope.gateways = [data];
                            }
                            $scope.editGatewaySection = false;
                        });
                    } else {
                        //$scope.editGatewayUuid
                    }

                };

                $scope.deleteGateway = function( idx ){

                    $rootScope.confirmModal($modal, $scope, $log, 'Delete Gateway','Are you sure you want to delete this gateway?',
                        function() {
                            $log.info('ok clicked');
                            var gateway_to_delete = $scope.gateways[idx];
                            deviceService.deleteDevice(gateway_to_delete.uuid, gateway_to_delete.token, function(data) {
                                $scope.gateways.splice(idx, 1);
                            });
                        },
                        function() {
                            $log.info('cancel clicked');
                        });

                };

                $scope.deleteSubdevice = function(parent, idx){
                    $rootScope.confirmModal($modal, $scope, $log, 'Delete Subdevice','Are you sure you want to delete this subdevice?',
                        function() {
                            $log.info('ok clicked');
                            var subName = $scope.gateways[parent].subdevices[idx].name
                            $scope.gateways[parent].subdevices.splice(idx,1)
                            socket.emit('gatewayConfig', {
                                "uuid": $scope.gateways[parent].uuid,
                                "token": $scope.gateways[parent].token,
                                "method": "deleteSubdevice",
                                "name": subName
                                // "name": $scope.gateways[parent].subdevices[idx].name
                            }, function (deleteResult) {
                                // alert(JSON.stringify(deleteResult));
                            });
                        },
                        function() {
                            $log.info('cancel clicked');
                        });

                };

                $scope.addSubdevice = function(gateway, pluginName, subDeviceName, deviceProperties){
                    console.log('add device properties ', deviceProperties);
                    socket.emit('gatewayConfig', {
                        "uuid": gateway.uuid,
                        "token": gateway.token,
                        "method": "createSubdevice",
                        "type": pluginName,
                        "name": subDeviceName,
                        "options": deviceProperties
                    }, function (addResult) {
                        console.log(addResult);
                    });
                };

                $scope.updateSubdevice = function(gateway, pluginName, subDeviceName, deviceProperties){
                  console.log('updating device properties ', deviceProperties);
                  socket.emit('gatewayConfig', {
                      "uuid": gateway.uuid,
                      "token": gateway.token,
                      "method": "updateSubdevice",
                      "type": pluginName,
                      "name": subDeviceName,
                      "options": deviceProperties
                  }, function (updateResult) {
                      console.log(updateResult);
                  });
                };

                $scope.deletePlugin = function(parent, idx){
                    $rootScope.confirmModal($modal, $scope, $log, 'Delete Plugin','Are you sure you want to delete this plugin?',
                        function() {
                            $log.info('ok clicked');
                            socket.emit('gatewayConfig', {
                                "uuid": $scope.gateways[parent].uuid,
                                "token": $scope.gateways[parent].token,
                                "method": "deletePlugin",
                                "name": $scope.gateways[parent].plugins[idx].name
                            }, function (deleteResult) {
                                alert('plugin deleted');
                            });
                        },
                        function() {
                            $log.info('cancel clicked');
                        });

                };

                $scope.addPlugin = function(gateway, pluginName){

                    socket.emit('gatewayConfig', {
                        "uuid": gateway.uuid,
                        "token": gateway.token,
                        "method": "installPlugin",
                        "name": pluginName
                    }, function (addResult) {
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
                    }).success(function(data, status, headers, config) {
                        console.log('npm search success',data);
                        $scope.plugins = data.results;

                        var modalInstance = $modal.open({
                            templateUrl: 'pluginModal.html',
                            scope: $scope,
                            controller: function ($modalInstance) {
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

                            $scope.plugin = response.plugin;
                            $scope.addPlugin($scope.selectedGateway, response.plugin);
                            if(!$scope.selectedGateway.plugins) $scope.selectedGateway.plugins = [];
                            $scope.selectedGateway.plugins.push({name: response.plugin})

                        }, function (){
                            $log.info('Modal dismissed at: ' + new Date());
                        });


                    }).error(function(data, status, headers, config) {
                        console.log('npm search failed',data);
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
                                var properties = _.map(deviceProperties, function(deviceProperty){
                                    delete deviceProperty.$$hashKey;
                                    delete deviceProperty.type;
                                    delete deviceProperty.required;
                                    return deviceProperty;
                                });

                                var options = {};
                                _.forEach(deviceProperties, function(property){
                                    options[property.name] = property.value;
                                });

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
                                socket.emit('gatewayConfig', {
                                    "uuid": $scope.selectedGateway.uuid,
                                    "token": $scope.selectedGateway.token,
                                    "method": "getDefaultOptions",
                                    "name": plugin.name
                                }, function (defaults) {
                                    // TODO: defaults are not returning - factor into object
                                    console.log('config:', defaults);
                                    console.log($scope.deviceProperties);
                                    _.each(defaults.result, function(value, key){
                                      for (var i in $scope.deviceProperties) {
                                        if($scope.deviceProperties[i].name == key){
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

                    }, function (){
                        $log.info('Modal dismissed at: ' + new Date());
                    });

                };


                $scope.openEditSubdevice = function (gateway, subdevice) {
                    console.log(subdevice);
                    $scope.selectedGateway = gateway;
                    $scope.selectedSubdevice = subdevice;
                    for(var l=0;l<$scope.selectedGateway.plugins.length;l++) {
                        if($scope.selectedGateway.plugins[l].name===subdevice.type) {
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
                            $scope.deviceProperties2 = _.map(devicePairs, function(devicePair){
                              return {
                                "name" : devicePair[0],
                                 "type" : 'string',
                                 "required": true,
                                 "value" : devicePair[1]
                              }
                            });
                            console.log($scope.deviceProperties2);
                            $scope.ok = function (deviceProperties) {
                                $scope._backup = false;
                                console.log(deviceProperties);
                                var properties = _.map(deviceProperties, function(deviceProperty){
                                    delete deviceProperty.$$hashKey;
                                    delete deviceProperty.type;
                                    delete deviceProperty.required;
                                    return deviceProperty;
                                });

                                var options = {};
                                _.forEach(deviceProperties, function(property){
                                    options[property.name] = property.value;
                                });
                                console.log('update', options);
                                $modalInstance.close({
                                    "subDeviceName" : $scope.selectedSubdevice.name,
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

            }); //end skynet.js

        });

    })
    .controller('connectorAdvancedController', function($scope, $http, $location, $modal, $log, $q, $state,
                                                ownerService, deviceService, channelService) {

      $scope.openNewApi = function() {
          $state.go('connector.advanced.channels.editor', { name: 'new' });
      };

    });
