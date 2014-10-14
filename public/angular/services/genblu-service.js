angular.module('octobluApp')
.service('GenbluService', function (deviceService, $q, skynetService) {
  'use strict';
  var self = this;

  var registerDevice = function(options) {
    return deviceService.registerDevice().then(function(device){
      return deviceService.updateDevice(_.extend({}, options, device));
    });
  };

  var updateGenblu = function(genblu){
    return deviceService.updateDevice(genblu).then(function(genblu){
      skynetService.getSkynetConnection().then(function(conn){
        conn.message({
          devices: genblu.uuid,
          topic: 'refresh',
          payload: genblu
        });
      });
      return;
    });
  };

  var waitForDeviceToHaveOptionsSchema = function(device){
    var deferred, waitFunction;
    deferred = $q.defer();

    skynetService.getSkynetConnection().then(function(conn){
      waitFunction = function(){
        deviceService.getDeviceByUUIDAndToken(device.uuid, device.token)
        .then(function(device){
          if(device && device.optionsSchema){
            clearInterval(waitFunction);
            deferred.resolve(device);
          }
        });

      };
      setInterval(waitFunction, 1000);
    });

    return deferred.promise;
  };

  self.addDevice = function(genbluId, nodeType){
    var device;

    return $q.all([
      registerDevice({genblu: genbluId, type: nodeType.type, category: 'device', connector: nodeType.connector}),
      deviceService.getDeviceByUUID(genbluId)
    ]).then(function(results){
      var genblu;
      device = results[0];
      genblu = results[1];

      genblu.devices = genblu.devices || [];
      genblu.devices.push(_.pick(device, 'uuid', 'token', 'connector', 'type'));
      return updateGenblu(genblu);
    }).then(function(){
      return waitForDeviceToHaveOptionsSchema(device);
    });
  };

  return self;
});
