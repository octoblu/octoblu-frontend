var _ = require('lodash');
var when = require('when');

var DeviceCollection = function (userUUID) {
  var collection = this;

  collection.fetch = function () {
    return collection.getUser(userUUID)
      .then(function (user) {
        return collection.getDevicesByOwner(user);
      });
  };

  collection.getUser = function (userUUID) {
    return User.findBySkynetUUID(userUUID);
  };

  collection.getDevicesByOwner = function (user) {
    console.log('made it!');
    console.log(user);
    return [];
  }

};

module.exports = DeviceCollection;
