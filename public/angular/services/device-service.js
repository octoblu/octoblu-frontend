'use strict';
angular.module('octobluApp')
    .service('deviceService', function ($q, $rootScope, $http, $cookies, MeshbluHttpService, skynetService, PermissionsService, reservedProperties, OCTOBLU_ICON_URL, UserSubscriptionService) {
        var myDevices, skynetPromise, _onDeviceChangeCallbacks, _onDeviceMessageCallbacks, subscribeToDevice, getMyDevices, myDevicesPromise;

        _onDeviceChangeCallbacks = [];
        _onDeviceMessageCallbacks = [];
        myDevices = [];
        skynetPromise = skynetService.getSkynetConnection();

        getMyDevices = function(){
          var defer = $q.defer();
          MeshbluHttpService.devices({owner: $cookies.meshblu_auth_uuid}, function (error, devices) {
            devices = _.map(devices, addDevice);
            devices = _.map(devices, addLogoUrl);
            myDevices = devices;
            defer.resolve(myDevices);
          });
          return defer.promise;
        };

        myDevicesPromise = getMyDevices();

        function addDevice(device) {
          UserSubscriptionService.createSubscriptions({emitterUuid: device.uuid, types: ['broadcast.sent', 'configure.sent']}, function(){
            return device;
          });
        }

        function addLogoUrl(data){
          if (!data) {
            return data;
          }
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
          if(data.type){
              var type = data.type.replace('octoblu:', 'device:');
              data.logo = OCTOBLU_ICON_URL + type.replace(':', '/') + '.svg';
          } else {
              data.logo = OCTOBLU_ICON_URL + 'device/other.svg';
          }
          return data;
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

            async.series([
              async.apply(UserSubscriptionService.createSubscriptions, {emitterUuid: $cookies.meshblu_auth_uuid, types: ['broadcast.received']}),
              async.apply(UserSubscriptionService.createSubscriptions, {emitterUuid: device.uuid, types: ['broadcast.sent']})
            ]);
        };

        var service = {
            onDeviceChange: function(onDeviceChangeCallback, $scope){
              if(!onDeviceChangeCallback || !$scope) {
                throw new Error('You must provide a callback and a scope');
              }

              _onDeviceChangeCallbacks.push(onDeviceChangeCallback);
              $scope.$on('$destroy', function(){
                _onDeviceChangeCallbacks = _.without(_onDeviceChangeCallbacks, onDeviceChangeCallback)
              });
            },

            onDeviceMessage: function(onDeviceMessageCallback, $scope) {
              if(!onDeviceMessageCallback || !$scope) {
                throw new Error('You must provide a callback and a scope');
              }
              _onDeviceMessageCallbacks.push(onDeviceMessageCallback);

              $scope.$on('$destroy', function(){
                _onDeviceMessageCallbacks = _.without(_onDeviceMessageCallbacks, onDeviceMessageCallback)
              });
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
                return service.getGateblus().then(function(devices){
                    return _.where(devices, {online: true});
                });
            },

            getGateblus: function(){
                return service.getDevices().then(function(devices){
                    return _.where(devices, {type: 'device:gateblu'});
                });
            },

            registerDevice: function (options) {
                var device = _.omit(options, reservedProperties),
                defer = $q.defer();

                device.owner = $cookies.meshblu_auth_uuid

                MeshbluHttpService.register(device, function (error, result) {
                  if (!error) {
                    myDevices.push(result);
                    defer.resolve(result);
                  }
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

              MeshbluHttpService.update(device.uuid, device, function (error) {
                if (error) {
                  defer.reject('Unable to update device');
                  return;
                }

                MeshbluHttpService.device(device.uuid, function(error, device){
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
