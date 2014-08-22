var _ = require('lodash');
var when = require('when');
var ChannelCollection = require('./channel-collection');
var DeviceCollection = require('./device-collection');
var config = require('../../config/auth')();

var NodeCollection = function (userUUID) {
  var self = this;

  self.fetch = function () {
    return when.all([self.getDevices(), self.getChannels()]).then(function (nodeResults) {
      return _.flatten(nodeResults, true);
    });

  };

  self.getChannelCollection = function () {
    return new ChannelCollection(userUUID);
  };

  self.getDevices = function () {
    var deviceCollection = self.getDeviceCollection();

    return deviceCollection.fetch()
      .then(function (devices) {
        return _.map(devices, self.convertDeviceToNode);
      });
  };

  self.getChannels = function () {
    var channelCollection = self.getChannelCollection();

    return channelCollection.fetch()
      .then(function (channels) {
        return _.map(channels, self.convertChannelToNode);
      });
  };

  self.convertChannelToNode = function(channel) {
    return _.extend({}, channel, {type: 'channel'});
  };

  self.convertDeviceToNode = function (device) {
    return _.defaults(device, {type: 'device'});
  };

  self.getDeviceCollection = function () {
    return new DeviceCollection(userUUID);
  };

  return self;
};

module.exports = NodeCollection;
