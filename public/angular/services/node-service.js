angular.module('octobluApp')
  .service('NodeService', function (OCTOBLU_API_URL, $q, $http, deviceService ) {
    'use strict';
    var self = this;

    var CACHE_TIMEOUT = 3000;
    var cacheTimeStamp;
    var requestPromise;

    self.getNodes = function (options) {
      options = options || {};
      var now = (new Date).getTime();

      if (!cacheTimeStamp || (now - cacheTimeStamp)>CACHE_TIMEOUT) {
        cacheTimeStamp = now;
        requestPromise = undefined;
      }

      if (requestPromise) {
        return requestPromise;
      }

      requestPromise = $http.get(OCTOBLU_API_URL + '/api/nodes', options)
        .then(function (results) {
          deviceService.clearCache();
          _.each(results.data, deviceService.addOrUpdateDevice);
          return deviceService.getDevices();
        });
      return requestPromise;
    };

    return self;
  });
