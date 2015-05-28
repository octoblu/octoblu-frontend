angular.module('octobluApp')
  .service('NodeService', function (OCTOBLU_API_URL, $q, $http, deviceService ) {
    'use strict';
    var self = this;

    self.getNodes = function (options) {
      options = options || {};

      return $http.get(OCTOBLU_API_URL + '/api/nodes', options).then(function (results) {
        deviceService.clearCache();
        _.each(results.data, deviceService.addOrUpdateDevice);
        return deviceService.getDevices();
      });
    };

    return self;
  });
