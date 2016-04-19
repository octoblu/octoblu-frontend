angular.module('octobluApp')
.service('GatebluService', function (deviceService, ThingService, $q, $cookies) {
  'use strict';
  var self = this;

  var registerDevice = function(options) {
    return deviceService.registerDevice(options);
  };

  var updateDevice = function(options) {
    return deviceService.updateDevice(options);
  };

  self.updateGateblu = function(results, logger){
    var gateblu, device;
    device = results[0];
    gateblu = results[1];

    gateblu.devices = gateblu.devices || [];
    gateblu.devices.push(_.pick(device, 'uuid', 'token', 'connector', 'type'));
    logger.registerDeviceEnd(device.uuid, gateblu.uuid, device.connector);
    logger.updateGatebluBegin(device.uuid, gateblu.uuid, device.connector);
    return deviceService.updateDevice(gateblu);
  };

  self.waitForDeviceToHaveOptionsSchema = function(device, logger){
    logger.deviceOptionsLoadBegin(device.uuid, device.gateblu, device.connector);

    var deferred, waitFunction, waitInterval;
    deferred = $q.defer();

    waitFunction = function(){
      deviceService.getDeviceByUUIDAndToken(device.uuid, device.token)
      .then(function(device){
        if(device && device.optionsSchema){
          deviceService.addOrUpdateDevice(device);

          logger.deviceOptionsLoadEnd(device.uuid, device.gateblu, device.connector);

          clearInterval(waitInterval);
          deferred.resolve(device);
        }
      });
    }

    waitInterval = setInterval(waitFunction, 1000);

    return deferred.promise;
  };

  // The new version of waitForDeviceToHaveOptionsSchema
  self.waitForEndOfInitializing = function(device, logger){
    logger.deviceOptionsLoadBegin(device.uuid, device.gateblu, device.connector);

    var deferred, waitFunction, waitInterval;
    deferred = $q.defer();

    waitFunction = function(){
      ThingService.getThing({uuid: device.uuid})
        .then(function(device){
          if(device && device.initializing){
            deviceService.addOrUpdateDevice(device);

            logger.deviceOptionsLoadEnd(device.uuid, device.gateblu, device.connector);

            clearInterval(waitInterval);
            deferred.resolve(device);
          }
        });
    };
    waitInterval = setInterval(waitFunction, 1000);

    return deferred.promise;
  };
  
  self.addDevice = function(gatebluId, nodeType, logger){
    var device;
    var userUuid = $cookies.meshblu_auth_uuid;
    logger.registerDeviceBegin(gatebluId, nodeType.connector)
    return $q.all([
      registerDevice({
        gateblu: gatebluId,
        type: nodeType.type,
        category: 'device',
        connector: nodeType.connector,
        initializing: true,
        sendWhitelist: [],
        receiveWhitelist: [],
        configureWhitelist: [gatebluId, userUuid],
        discoverWhitelist: [gatebluId, userUuid],
        sendAsWhitelist: [gatebluId],
        receiveAsWhitelist: [gatebluId],
        configureAsWhitelist: [],
        discoverAsWhitelist: []
      }),
      deviceService.getDeviceByUUID(gatebluId)
    ])
  };

  self.updateDevice = function(device, gatebluId, logger){
    var device;
    var userUuid = $cookies.meshblu_auth_uuid;
    logger.registerDeviceBegin(gatebluId, device.connector)
    return $q.all([
      updateDevice({
        uuid: device.uuid,
        gateblu: gatebluId,
        initializing: true,
        sendWhitelist: [],
        receiveWhitelist: [],
        configureWhitelist: [gatebluId, userUuid],
        discoverWhitelist: [gatebluId, userUuid],
        sendAsWhitelist: [gatebluId],
        receiveAsWhitelist: [gatebluId],
        configureAsWhitelist: [],
        discoverAsWhitelist: []
      }),
      deviceService.getDeviceByUUID(gatebluId)
    ])
  };

  return self;
});
