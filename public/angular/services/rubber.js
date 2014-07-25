angular.module('octobluApp')
.service('RubberService', function () {
  this.buildDevices = function(devices){
    return _.map(devices, function(device){
      return 'uuid='+device.uuid;
    }).join(' OR ');
  };
});
