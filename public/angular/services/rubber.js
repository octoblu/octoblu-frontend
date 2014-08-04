'use strict';
angular.module('octobluApp')
.service('RubberService', function () {
  this.buildDevices = function(devices){
    return _.map(devices, function(device){
      return 'uuid='+device.uuid;
    }).join(' OR ');
  };

  this.getDateFormats = function(){
    return {
      "now":          { "text": "Now", "value": "now", "esel": "selected=selected" },
      "yesterday":    { "text": "Yesterday", "value": "now-1d/d"},
      "4_hours_ago":  { "text": "4 Hours Ago", "value":"now-4h/h"},
      "12_hours_ago": { "text": "12 Hours Ago", "value":"now-12h/h" },
      "24_hours_ago": { "text": "24 Hours Ago", "value":"now-24h/h" },
      "this_week":    { "text": "Week to date", "value" : "now-1w/w" },
      "30_days":      { "text": "30 Days Ago", "value" : "now-30d/d", "ssel":"selected=selected"}
    };
  };

  this.setOwnedDevices = function(devices){
    this.devices = {
      object: devices,
      logic:  this.buildDevices(devices)
    };
  };
});

