var _ = require('lodash');
var when = require('when');
var ChannelCollection = require('./channel-collection');
var DeviceCollection = require('./device-collection');
var config = require('../../config/auth')();

var NodeCollection = function (userUUID) {
  var self = this, timeout = config.promiseTimeout;

  self.fetch = function () {
    var deviceCollection = self.getDeviceCollection();
    var channelCollection = self.getChannelCollection();

    var devicePromise = deviceCollection.fetch()
      .then(function (devices) {
        return _.map(devices, self.convertDeviceToNode);
      })
      .timeout(timeout)
      .catch(function (err) {
        return [];
      });

    var channelPromise = channelCollection.fetch()
      .then(function (channels) {
        return _.map(channels, self.convertChannelToNode);
      })
      .timeout(timeout)
      .catch(function (err) {
        return [];
      });

    return when.all([devicePromise, channelPromise]).then(function (nodeResults) {
      return _.flatten(nodeResults, true);
    });

  };

  self.getChannelCollection = function () {
    return new ChannelCollection(userUUID);
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
