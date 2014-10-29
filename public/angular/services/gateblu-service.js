angular.module('octobluApp')
.service('GatebluService', function (deviceService, $q, skynetService) {
  'use strict';
  var self = this;

  var registerDevice = function(options) {
    return deviceService.registerDevice().then(function(device){
      return deviceService.updateDevice(_.extend({}, options, device));
    });
  };

  var updateGateblu = function(gateblu){
    return deviceService.updateDevice(gateblu).then(function(gateblu){
      skynetService.getSkynetConnection().then(function(conn){
        conn.message({
          devices: gateblu.uuid,
          topic: 'refresh',
          payload: gateblu
        });
      });
      return;
    });
  };

  var waitForDeviceToHaveOptionsSchema = function(device){
    var deferred, waitFunction, waitInterval;
    deferred = $q.defer();

    skynetService.getSkynetConnection().then(function(conn){
      waitFunction = function(){
        deviceService.getDeviceByUUIDAndToken(device.uuid, device.token)
        .then(function(device){
          if(device && device.optionsSchema){
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

    return $q.all([
      registerDevice({gateblu: gatebluId, type: nodeType.type, category: 'device', connector: nodeType.connector}),
      deviceService.getDeviceByUUID(gatebluId)
    ]).then(function(results){
      var gateblu;
      device = results[0];
      gateblu = results[1];

      gateblu.devices = gateblu.devices || [];
      gateblu.devices.push(_.pick(device, 'uuid', 'token', 'connector', 'type'));
      return updateGateblu(gateblu);
    }).then(function(){
      return waitForDeviceToHaveOptionsSchema(device);
    });
  };

  return self;
});
