angular.module('octobluApp')
  .service('NodeService', function (OCTOBLU_API_URL, $q, $http, deviceService ) {
    'use strict';
    var self = this;

    var CACHE_TIMEOUT = 3000;
    var cacheTimeStamp;
    var resolvedPromise;
    var pendingPromise;

    self.getNodes = function (options) {
      options = options || {};
      var now = (new Date).getTime();

      if (!pendingPromise && (!cacheTimeStamp || (now - cacheTimeStamp)>CACHE_TIMEOUT)) {
        pendingPromise = $http.get(OCTOBLU_API_URL + '/api/nodes', options)
        .then(function (results) {
          deviceService.clearCache();
          _.each(results.data, deviceService.addOrUpdateDevice);
          var result = deviceService.getDevices();
          cacheTimeStamp = (new Date).getTime();
          resolvedPromise = pendingPromise;
          pendingPromise = undefined;
          return result;
        }, function(reason) {
          pendingPromise = undefined;
          console.error(reason);
        });
      };
      return resolvedPromise || pendingPromise;
    }
    return self;
  });
