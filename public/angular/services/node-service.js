angular.module('octobluApp')
  .service('NodeService', function ($q, $http, deviceService, NodeTypeService, skynetService) {
    'use strict';
    var self = this;

    self.getNodes = function (options) {
      options = options || {};

      return $http.get('/api/nodes', options).then(function (results) {
        return results.data
          .map(deviceService.getAutoUpdatingDevice)
          .map(deviceService.addLogoUrl);
      });
    };

    self.getSubdeviceNodes = function() {
      return self.getNodes({cache: true}).then(function(results){
        return _.filter(results, {category: 'subdevice'});
      });
    };

    self.subdevicesToDevices = function(gatewayUuid, gatewayConfig) {

      if(!gatewayConfig) {
        return [];
      }

      return _.map(gatewayConfig.subdevices, function(subdevice){
          var newSubdevice = _.clone(subdevice);

          newSubdevice.uuid =  gatewayUuid + '/' + subdevice.uuid;
          newSubdevice.category = 'subdevice';
          newSubdevice.online = true;

          newSubdevice.type = 'device:' +  subdevice.type.replace('skynet-', '');
          newSubdevice = deviceService.addLogoUrl(newSubdevice);

          newSubdevice.plugin = _.findWhere(gatewayConfig.plugins, { name: subdevice.type });

          return newSubdevice;
      });
    };

    return self;
  });
