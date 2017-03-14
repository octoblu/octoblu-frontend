angular.module('octobluApp')
  .service('ProcessNodeService', function ($q, deviceService, FirehoseService)  {
  'use strict';
  return {

    getProcessNodes: function() {
      var self;
      self = this;
      return self.getDevices()
        .then(function(devices) {
          self.devices = devices;
          self.listenToMessages();
          return self.devices;
        });
    },

    listenToMessages: function() {
      var self = this;
      FirehoseService.on('message', function(message){
        var data = message.data;
        self.incrementMessagesReceivedCount(data);
        self.incrementMessagesSentCount(data);
      });
    },

    incrementMessagesReceivedCount: function(message) {
      var self = this;
      if(!_.isArray(message.devices)){
        message.devices = [message.devices];
      }
      var devices = _.filter(self.devices, function(device) {
        if(_.includes(message.devices, device.uuid)){
          return device;
        }
      });

      _.each(devices, function(device) {
        device.messagesReceived = device.messagesReceived || 0;
        device.messagesReceived++;
      });
    },

    incrementMessagesSentCount: function(message) {
      var self = this;
      var devices = _.filter(self.devices, function(device) {
        if(message.fromUuid === device.uuid){
          return device;
        }
      });

      _.each(devices, function(device) {
        device.messagesSent = device.messagesSent || 0;
        device.messagesSent++;
      });
    },

    getDevices: function() {
      return deviceService.getDevices(true).then(function(devices){
        _.each(devices, function(device){
          device.messagesReceived = 0;
          device.messagesSent = 0;
        });
        return devices;
      });
    },

    sendMessageToDevice: function(uuid, topic){
      message = {
        devices: [uuid],
        topic: topic
      }
      MeshbluHttpService.message(message);
    },

    startProcess: function(node) {
      this.sendMessageToDevice(node.uuid, 'device-start')
    },

    stopProcess: function(node) {
      this.sendMessageToDevice(node.uuid, 'device-stop');
    }
  };
});
