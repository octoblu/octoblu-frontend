angular.module('octobluApp')
.service('RubberService', function () {
  this.buildDevices = function(devices){
    return _.map(devices, function(device){
      return 'uuid='+device.uuid;
    }).join(' OR ');
  };

  this.setOwnedDevices = function(devices){
    this.devices = {
      object: devices,
      logic:  this.buildDevices(devices)
    };
  };
});

