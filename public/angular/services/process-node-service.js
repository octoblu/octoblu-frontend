angular.module('octobluApp')
  .service('ProcessNodeService', function ($q, deviceService, skynetService) {
  'use strict';
  return {

    getProcessNodes: function() {
      var self, skynetConnection;
      self = this;
      return $q.all([
        self.getSkynetConnection(),
        self.getDevices()
      ]).then(function(results) {
        skynetConnection = results[0];
        self.devices = results[1];
        self.listenToMessages();
        return self.devices;
      });
    },

    listenToMessages: function() {
      var self = this;
      return self.getSkynetConnection().then(function(skynetConnection){
        skynetConnection.on('message', function(message) {
          self.incrementMessagesReceivedCount(message);
          self.incrementMessagesSentCount(message);
        });
      });
    },

    incrementMessagesReceivedCount: function(message) {
      var self = this;
      if(!_.isArray(message.devices)){
        message.devices = [message.devices];
      }
      var devices = _.filter(self.devices, function(device) {
        if(_.contains(message.devices, device.uuid)){
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

    getSkynetConnection: function() {
      return skynetService.getSkynetConnection()
    },

    sendMessageToDevice: function(uuid, topic){
      this.getSkynetConnection().then(function(skynetConnection){
        skynetConnection.message(uuid, null, {topic: topic});
      });
    },

    startProcess: function(node) {
      this.sendMessageToDevice(node.uuid, 'device-start')
    },

    stopProcess: function(node) {
      if(node.type === 'octoblu:flow'){
        this.sendMessageToDevice(node.uuid, 'nodered-instance-stop')
        return;
      }
      this.sendMessageToDevice(node.uuid, 'device-stop');
    }
  };
});
