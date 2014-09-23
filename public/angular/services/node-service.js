angular.module('octobluApp')
  .service('NodeService', function ($q, $http, deviceService, NodeTypeService) {
    'use strict';

    var self = this;

    self.getNodes = function () {
      return $http.get('/api/nodes')
        .then(function (results) {
          return $q.all(_.map(results.data, function(device){
            return deviceService.addLogoUrl(device);
          }));
        }).then(function(results){
          var devices = _.flatten(results, true);
          var gateways = _.filter(devices, {type: 'gateway', online: true});

          return $q.all(_.map(gateways, function (gateway) {
            return deviceService.gatewayConfig({
              "uuid": gateway.uuid,
              "token": gateway.token,
              "method": "configurationDetails"
            })
              .then(function (response) {
                return subdevicesToDevices(gateway.uuid, response.result);
              }, function (err) {
                return [];
              });
          }))
            .then(function (results) {
              var nodes = _.union(devices, _.flatten(results));
              return nodes;
            });
        });
    };

    self.getSubdeviceNodes = function() {
      return self.getNodes().then(function(results){
        return _.filter(results, {category: 'subdevice'});
      })
    }

    function subdevicesToDevices(gatewayUuid, gatewayConfig) {

      if(!gatewayConfig) {
        return [];
      }

      return _.map(gatewayConfig.subdevices, function(subdevice){
          var newSubdevice = _.clone(subdevice);

          newSubdevice.uuid =  gatewayUuid + '/' + subdevice.uuid;
          newSubdevice.category = 'subdevice';
          newSubdevice.online = true;

          newSubdevice.type = 'subdevice:' +  subdevice.type.replace('skynet-', '');
          newSubdevice = deviceService.addLogoUrl(newSubdevice);

          return newSubdevice;
      });
    }
    return self;
  });
