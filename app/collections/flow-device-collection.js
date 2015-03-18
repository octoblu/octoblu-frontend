var config = require('../../config/auth'),
  _ = require('lodash'),
  when = require('when'),
  rest = require('rest'),
  mime = require('rest/interceptor/mime'),
  errorCode = require('rest/interceptor/errorCode'),
  client = rest.wrap(mime).wrap(errorCode);

var FlowDeviceCollection = function (userUUID, userToken) {
  var self = this;
  var User = require('../models/user');

  self.fetch = function () {
    return self.getDevicesByOwner().then(function(devices){
      return _.filter(devices, {type: 'octoblu:flow'});
    })
  };

  self.getDevicesByOwner = function () {
    var requestParams = {
      method: 'GET',
      path: 'http://' + config.skynet.host + ':' +
        config.skynet.port + '/mydevices',
      headers: {
        meshblu_auth_uuid: userUUID,
        meshblu_auth_token: userToken
      }
    };

    return client(requestParams).then(function (result) {
      return result.entity.devices;
    }).catch(function () {
      return [];
    });
  };
};

module.exports = FlowDeviceCollection;
