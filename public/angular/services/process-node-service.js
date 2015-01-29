angular.module('octobluApp')
  .service('ProcessNodeService', function ($q, deviceService, skynetService) {
  'use strict';
  return {
    getProcessDevices: function() {
      var self = this;
      
      return deviceService.getDevices().then(function(devices){
        self.devices = devices;
      }).then(function() {
        return skynetService.getSkynetConnection()
      }).then(function(skynetConnection) {
        _.map(self.devices, skynetConnection.subscribe);
        return self.devices;
      })
    },

    stopProcess: function(processUUID) {
      skynetService.getSkynetConnection().then(function(skynetConnection){
        skynetConnection.message(processUUID, null, {topic: 'device-stop'});
      });
    },

    startProcess: function(processUUID) {
      skynetService.getSkynetConnection().then(function(skynetConnection){
        skynetConnection.message(processUUID, null, {topic: 'device-start'});
      });
    }
  };
});
