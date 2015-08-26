angular.module('octobluApp')
.service('GatebluService', function (deviceService, $q, $cookies, skynetService, GatebluLogService) {
  'use strict';
  var self = this;

  var registerDevice = function(options) {
    GatebluLogService.registerDeviceBegin(options);
    return deviceService.registerDevice(options);
  };

  var updateGateblu = function(gateblu){
    GatebluLogService.updateGatebluBegin(gateblu);
    return deviceService.updateDevice(gateblu);
  };

  var waitForDeviceToHaveOptionsSchema = function(device){
    var deferred, waitFunction, waitInterval;
    deferred = $q.defer();

    skynetService.getSkynetConnection().then(function(conn){
      waitFunction = function(){
        deviceService.getDeviceByUUIDAndToken(device.uuid, device.token)
        .then(function(device){
          if(device && device.optionsSchema){
            GatebluLogService.deviceOptionsLoaded(device);
            deviceService.addOrUpdateDevice(device);

            clearInterval(waitInterval);
            deferred.resolve(device);
          }
        });

      };
      waitInterval = setInterval(waitFunction, 1000);
    });

    return deferred.promise;
  };

  self.addDevice = function(gatebluId, nodeType){
    var device;
    var userUuid = $cookies.meshblu_auth_uuid;

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

      GatebluLogService.registerDeviceEnd(device);
      return updateGateblu(gateblu);
    }).then(function(){
      GatebluLogService.updateGatebluEnd(device)
      return waitForDeviceToHaveOptionsSchema(device);
    });
  };

  return self;
});
