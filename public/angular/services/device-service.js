'use strict';
angular.module('octobluApp')
.service('deviceService', function ($q, $rootScope, $http, $cookies, MeshbluHttpService, PermissionsService, reservedProperties, MESHBLU_HOST, MESHBLU_PORT, MESHBLU_PROTOCOL, UserSubscriptionService, DeviceLogo) {
  var myDevices, _onDeviceChangeCallbacks, _onDeviceMessageCallbacks, subscribeToDevice, getMyDevices, myDevicesPromise;

  _onDeviceChangeCallbacks = [];
  _onDeviceMessageCallbacks = [];
  myDevices = [];

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
    if (myDevices && myDevices.length) {
      var device = _.find(myDevices, { uuid: data.uuid });
      if(device && device.logo){
        data.logo = device.logo;
        return data;
      }
    }
    data.logo = new DeviceLogo(data).get();
    return data;
  }

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
      var meshbluHttp = new MeshbluHttp({
          hostname: MESHBLU_HOST,
          port: MESHBLU_PORT,
          protocoL: MESHBLU_PROTOCOL,
          uuid: uuid,
          token: token
        });
      meshbluHttp.device(uuid, function(error, device){
        if (error) {
          return deferred.reject(error)
        }
        deferred.resolve(device);
      });

      return deferred.promise;
    },

    refreshDevices: function(){
      return service.getDevices(true).then(function(){
        return undefined;
      });
    },

    claimDevice: function (options) {
      var defer = $q.defer();

      MeshbluHttpService.claimdevice(options.uuid, function(error){
        if(error) {
          return defer.reject(error);
        }
        service.updateDevice(options)
        .then(function(){
          return service.refreshDevices();
        })
        .then(function(){
          return service.getDeviceByUUID(options.uuid);
        })
        .then(function(device){
          return defer.resolve(device);
        });
      });
      return defer.promise
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
      MeshbluHttpService.unregister(device, function (error) {
        if (error) {
          return defer.reject(error);
        }
        myDevices.length = 0;
        defer.resolve();
      });

      return defer.promise;
    },

    addLogoUrl: addLogoUrl,

    resetToken: function(uuid) {
      var defer = $q.defer();
      MeshbluHttpService.resetToken(uuid, function(error, response){
        if (error) {
          return defer.reject(error);
        }
        var token = response.token;
        if(!token) {
          return defer.reject(new Error('No token provided'));
        }
        defer.resolve(token);
      });
      return defer.promise;
    }
  };

  return service;
});
