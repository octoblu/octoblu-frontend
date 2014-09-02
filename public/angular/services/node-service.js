angular.module('octobluApp')
  .service('NodeService', function ($q, $http, deviceService) {
    'use strict';

    var self = this;

    self.getNodes = function () {
      return $http.get('/api/nodes')
        .then(function (results) {
          var devices = results.data;
          var gateways = _.filter(devices, {type: 'gateway', online: true});

          return $q.all(_.map(gateways, function (gateway) {
            return deviceService.gatewayConfig({
              "uuid": gateway.uuid,
              "token": gateway.token,
              "method": "configurationDetails"
            })
              .then(function (response) {
                return  response.result ? response.result.subdevices : [];
              }, function (err) {
                return [];
              });
          }))
            .then(function (results) {
              return _.union(devices, _.flatten(results));
            });
        });
    };

    return self;
  });