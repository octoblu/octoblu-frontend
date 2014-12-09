var config = require('../../config/auth'),
  _ = require('lodash'),
  when = require('when'),
  rest = require('rest'),
  mime = require('rest/interceptor/mime'),
  errorCode = require('rest/interceptor/errorCode'),
  client = rest.wrap(mime).wrap(errorCode);

var DeviceCollection = function (userUUID) {
  var self = this;
  var User = require('../models/user');

  self.fetch = function () {
    return self.getUser(userUUID).then(function (user) {
      return self.getDevicesByOwner(user).then(function(devices){
        return _.reject(devices, {type: 'octoblu:flow'});
      });
    });
  };

  self.getUser = function (userUUID) {
    return User.findBySkynetUUID(userUUID);
  };

  self.getDevicesByOwner = function (user) {
    var requestParams = {
      method: 'GET',
      path: 'http://' + config.skynet.host + ':' +
        config.skynet.port + '/mydevices',
      headers: {
        skynet_auth_uuid: user.skynet.uuid,
        skynet_auth_token: user.skynet.token
      }
    };

    return client(requestParams).then(function (result) {
      return result.entity.devices;
    }).catch(function () {
      return [];
    });
  };
};

module.exports = DeviceCollection;
