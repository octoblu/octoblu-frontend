angular.module('octobluApp')
.service('GatebluService', function (deviceService, $q, $cookies, skynetService, GatebluLogService) {
  'use strict';
  var self = this;

  var registerDevice = function(options) {
    return deviceService.registerDevice(options);
  };

  var updateGateblu = function(gateblu, logger){
    logger.updateGatebluBegin(gateblu);
    return deviceService.updateDevice(gateblu);
  };

  var waitForDeviceToHaveOptionsSchema = function(device, logger){
    logger.deviceOptionsLoadBegin(device);

    var deferred, waitFunction, waitInterval;
    deferred = $q.defer();

    skynetService.getSkynetConnection().then(function(conn){
      waitFunction = function(){
        deviceService.getDeviceByUUIDAndToken(device.uuid, device.token)
        .then(function(device){
          if(device && device.optionsSchema){
            deviceService.addOrUpdateDevice(device);

            logger.deviceOptionsLoadEnd(device);

            clearInterval(waitInterval);
            deferred.resolve(device);
          }
        });

      };
      waitInterval = setInterval(waitFunction, 1000);
    });

    return deferred.promise;
  };

  self.addDevice = function(gatebluId, nodeType, logger){
    var device;
    var userUuid = $cookies.meshblu_auth_uuid;
    logger.registerDeviceBegin(nodeType)
    return $q.all([
      registerDevice({
        gateblu: gatebluId,
        type: nodeType.type,
        category: 'device',
        connector: nodeType.connector,
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
    ]).then(function(results){
      var gateblu;
      device = results[0];
      gateblu = results[1];

      gateblu.devices = gateblu.devices || [];
      gateblu.devices.push(_.pick(device, 'uuid', 'token', 'connector', 'type'));

      logger.registerDeviceEnd(device);
      return updateGateblu(gateblu, logger);
    }).then(function(){
      logger.updateGatebluEnd(device);
      return waitForDeviceToHaveOptionsSchema(device, logger);
    });
  };

  return self;
});
