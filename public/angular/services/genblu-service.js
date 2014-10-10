angular.module('octobluApp')
.service('GenbluService', function (deviceService, $q) {
  'use strict';
  var self = this;

  var registerDevice = function(options) {
    return deviceService.registerDevice().then(function(device){
      return deviceService.updateDevice(_.extend({}, options, device));
    });
  };

  var updateGenblu = function(genblu){
    return deviceService.updateDevice(genblu).then(function(genblu){
      // Here is where the topic: refresh message to genblu will go
    });
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
      genblu.devices.push(_.pick(device, 'uuid', 'token', 'connector'));
      return updateGenblu(genblu);
    }).then(function(){
      return device;
    });
  };

  return self;
});
