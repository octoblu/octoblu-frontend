'use strict';
angular.module('octobluApp')
    .service('deviceService', function ($q, $rootScope, $http, skynetService, PermissionsService, reservedProperties, OCTOBLU_ICON_URL) {
        var myDevices, skynetPromise, _onDeviceChangeCallbacks, _onDeviceMessageCallbacks, subscribeToDevice, getMyDevices, myDevicesPromise;

        _onDeviceChangeCallbacks = [];
        _onDeviceMessageCallbacks = [];
        myDevices = [];
        skynetPromise = skynetService.getSkynetConnection();
        getMyDevices = function(){
          return skynetPromise.then(function(skynetConnection){
            var defer = $q.defer();
            skynetConnection.mydevices({}, function (result) {
                var devices = _.cloneDeep(result.devices);
                devices = _.map(devices, addDevice);
                devices = _.map(devices, addLogoUrl);
                async.map(devices, addMessageSchemaFromUrl, function(error, devices) {
                  if (error) {
                    return defer.reject(error);
                  }
                  myDevices = devices;
                  defer.resolve(myDevices);
                });
            });
            return defer.promise;
          });
        };
        myDevicesPromise = getMyDevices();

        function addDevice(device) {
            skynetPromise.then(function (skynetConnection) {
              if (!_.findWhere(skynetConnection.subscriptions, {uuid: device.uuid})) {
                skynetConnection.subscribe({uuid: device.uuid, types: ['received', 'broadcast']});
              }
            });
            return device;
        }

        function addLogoUrl(data){
          if(data.logo){
            return data;
          }
          if (myDevices && myDevices.length) {
            var device = _.find(myDevices, { uuid: data.uuid });
            if(device && device.logo){
              data.logo = device.logo;
              return data;
            }
          }
          if(data && data.type){
              var type = data.type.replace('octoblu:', 'device:');
              data.logo = OCTOBLU_ICON_URL + type.replace(':', '/') + '.svg';
          } else {
              data.logo = OCTOBLU_ICON_URL + 'device/other.svg';
          }
          return data;
        }

        function loadMessageSchemaFromUrl(url, callback) {
          $http.get(url).success(function(data, status, headers, config){
            return callback(null, data);
          })
          .error(function(data, status, headers, config){
            return callback(new Error());
          });
        }

        function addMessageSchemaFromUrl(data, callback){
          if(data.messageSchema){
            return callback(null, data);
          }
          if(!data.messageSchemaUrl){
            return callback(null, data);
          }
          if (myDevices && myDevices.length) {
            var device = _.find(myDevices, { uuid: data.uuid });
            if(device && device.messageSchema){
              data.messageSchema = device.messageSchema;
              return callback(null, data);
            }
          }
          loadMessageSchemaFromUrl(data.messageSchemaUrl, function(error, messageSchema){
            data.messageSchema = messageSchema;
            return callback(null, data);
          });
        }

        skynetPromise.then(function (skynetConnection) {
            skynetConnection.on('message', function (message) {
                _.each(_onDeviceMessageCallbacks, function(callback){
                  callback(message);
                });

                $rootScope.$broadcast('skynet:message:' + message.fromUuid, message);
                if (message.payload && _.has(message.payload, 'online')) {
                    var device = _.findWhere(myDevices, {uuid: message.fromUuid});
                    if (device) {
                        device.online = message.payload.online;
                    }
                }
                $rootScope.$apply();
            });

            skynetConnection.on('config', service.addOrUpdateDevice);
        });


        subscribeToDevice = function(device){
            if(device.category === 'channel') {
                return;
            }

            skynetPromise.then(function (skynetConnection) {
              return skynetConnection.subscribe({uuid: device.uuid, token: device.token, types: ['received', 'broadcast']});
            });
        };

        var service = {
            onDeviceChange: function(onDeviceChangeCallback){
              _onDeviceChangeCallbacks.push(onDeviceChangeCallback);
            },

            onDeviceMessage: function(onDeviceMessageCallback){
              _onDeviceMessageCallbacks.push(onDeviceMessageCallback);
            },

            addOrUpdateDevice: function(device){
                _.each(_onDeviceChangeCallbacks, function(callback){
                  callback(device);
                });
                subscribeToDevice(device);
                if (device.type === 'octoblu:flow') {
                  return;
                }
                var existingDevice = _.findWhere(myDevices, {uuid: device.uuid});
                if(existingDevice) {
                    _.extend(existingDevice, device);
                    return;
                }
                myDevices.push(device);
            },
            getDevices: function (force) {
              if (myDevices && myDevices.length && !force) {
                return $q.when(myDevices);
              }
              if (force) {
                return getMyDevices();
              }
              return myDevicesPromise.then(function(devices){
                return devices;
              });
            },

            getSharedDevices: function (force) {
                return PermissionsService.getSharedResources('device').then(function(devices){
                       return _.map(devices, function(device){
                            return device.target;
                       });
                });
            },
            getDeviceByUUID: function(uuid, force){
                return service.getDevices(force).then(function(devices){
                    return _.findWhere(devices, {uuid: uuid});
                });
            },

            getDeviceByUUIDAndToken: function(uuid, token){
                var deferred = $q.defer();

                skynetPromise.then(function(skynetConnection){
                    skynetConnection.devices({uuid:uuid, token:token}, function(data){
                        deferred.resolve(_.first(data.devices));
                    }, deferred.reject);
                });

                return deferred.promise;
            },

            refreshDevices: function(){
                return service.getDevices(true).then(function(){
                    return undefined;
                });
            },

            getGateways: function(){
                return service.getDevices().then(function(devices){
                    return _.where(devices, {type: 'gateway'});
                });
            },

            getOnlineGateblus: function(){
                return service.getDevices().then(function(devices){
                    return _.where(devices, {type: 'device:gateblu', online: true});
                });
            },

            registerDevice: function (options) {
                var device = _.omit(options, reservedProperties),
                    defer = $q.defer();

                skynetPromise.then(function (skynetConnection) {
                    device.owner = skynetConnection.options.uuid;

                    skynetConnection.register(device, function (result) {
                        myDevices.push(result);
                        defer.resolve(result);
                    });
                });
                return defer.promise;
            },

            claimDevice: function (options) {
                var deviceOptions = _.omit(options, reservedProperties);

                return skynetPromise.then(function(skynetConnection){
                    var defer = $q.defer();
                 skynetConnection.claimdevice(deviceOptions, function(result){
                        if(result.error) {
                            return defer.reject(result.error);
                        }
                        service.updateDevice(deviceOptions).then(function(updatedDevice) {
                            defer.resolve(updatedDevice);
                        });
                    });

                    return defer.promise;
                })
                .then(function(){
                    return service.refreshDevices();
                })
                .then(function(){
                    return service.getDeviceByUUID(deviceOptions.uuid);
                });
            },

            updateDevice: function (options) {
                var device = _.omit(options, reservedProperties),
                    defer = $q.defer();

                skynetPromise.then(function (skynetConnection) {
                    skynetConnection.update(device, function (data) {
                        if (data && data.error) {
                          defer.reject('Unable to claim device');
                          return;
                        }

                        defer.resolve(device);
                    });
                });

                return defer.promise;
            },

            clearCache: function() {
                myDevices.length = 0;
            },

            unregisterDevice: function (device) {
                var defer = $q.defer();

                skynetPromise.then(function (skynetConnection) {
                    skynetConnection.unregister(device, function (result) {
                        myDevices.length = 0;
                        defer.resolve();
                    });
                });

                return defer.promise;
            },

            getUnclaimed: function (nodeType) {
                if(nodeType === 'gateway'){
                    return service.getUnclaimedGateways();
                }

                if(nodeType === 'device') {
                    return service.getUnclaimedDevices();
                }

                var query = {type: nodeType};
                return service.getUnclaimedNodes(query).then(function(devices){
                    return _.where(devices, query);
                });
            },

            getUnclaimedDevices: function () {
                var query = {type: {$ne: 'gateway'}};
                return service.getUnclaimedNodes(query).then(function (devices) {
                    return _.filter(devices, function(device){
                        return (device.type !== 'gateway');
                    });
                });
            },

            getUnclaimedGateways: function () {
                var query = {type: 'gateway'};
                return service.getUnclaimedNodes(query).then(function (devices) {
                    return _.where(devices, query);
                });
            },

            getUnclaimedNodes: function(query) {
                query = query || {online: true};
                var defer = $q.defer();

                skynetPromise.then(function (skynetConnection) {
                    skynetConnection.unclaimeddevices(query, function (result) {
                        var devices = _.where(result.devices, query);
                        devices = _.map(devices, addLogoUrl);
                        defer.resolve(devices);
                    });
                });

                return defer.promise;
            },

            addLogoUrl: addLogoUrl,

            resetToken: function(uuid) {
                var defer = $q.defer();
                skynetPromise.then(function (skynetConnection) {
                    return skynetConnection.resetToken(uuid, function(response){
                        var token = response.token;
                        if(!token) {
                            return defer.reject(new Error('No token provided'));
                        }
                        defer.resolve(token);
                    });
                });
                return defer.promise;
            }
        };

        return service;
    });
