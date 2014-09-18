angular.module('octobluApp')
  .service('NodeService', function ($q, $http, deviceService) {
    'use strict';

    var self = this;

    self.getNodes = function () {
      return $http.get('/api/nodes')
        .then(function (results) {
          var devices = _.map(results.data, function(device){
            return deviceService.addLogoUrl(device);
          });

          var gateways = _.filter(devices, {type: 'gateway', online: true});

          return $q.all(_.map(gateways, function (gateway) {
            return deviceService.gatewayConfig({
              "uuid": gateway.uuid,
              "token": gateway.token,
              "method": "configurationDetails"
            })
              .then(function (response) {
                return response.result ? response.result.subdevices : [];
              }, function (err) {
                return [];
              })
              .then(function(subdevices){
                return _.map(subdevices, function(subdevice){
                  //subdevice
                  subdevice.category = 'subdevice';
                  subdevice.online = true;

                  subdevice.nodeType = {
                    logo: "https://s3-us-west-2.amazonaws.com/octoblu-icons/generic-device.png"
                  };

                  return subdevice;
                });
              });
          }))
            .then(function (results) {
              var nodes = _.union(devices, _.flatten(results));
              return nodes;
            });
        });
    };

    return self;
  });
