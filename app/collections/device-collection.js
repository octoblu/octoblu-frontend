var config = require('../../config/auth')(),
  mongoose = require('mongoose'),
  _ = require('lodash'),
  when = require('when'),
  rest = require('rest'),
  mime = require('rest/interceptor/mime'),
  errorCode = require('rest/interceptor/errorCode'),
  client = rest.wrap(mime).wrap(errorCode);

var DeviceCollection = function (userUUID) {
  var self = this;
  var User = mongoose.model('User');

  self.fetch = function () {
    return self.getUser(userUUID)
      .then(function (user) {
        return self.getDevicesByOwner(user);
      });
  };

  self.getUser = function (userUUID) {
    return User.findBySkynetUUID(userUUID);
  };

  self.getDevicesByOwner = function (user) {
    return client({
      method: 'GET',
      path: 'http://' + config.skynet.host + ':' +
        config.skynet.port + '/mydevices',
      headers: {
        skynet_auth_uuid: user.skynetuuid,
        skynet_auth_token: user.skynettoken
      }
    })
      .then(function (result) {
        return result.entity.devices;
      })
      .catch(function () {
        return [];
      });
  };
};

module.exports = DeviceCollection;
