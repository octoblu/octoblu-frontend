angular.module('octobluApp')
  .service('ProcessNodeService', function ($q, deviceService) {
	'use strict';
	return {
		getProcessDevices: function() {
			return deviceService.getDevices();
		},

		stopProcess: function(processNode) {
		},

		startProcess: function(processNode) {
		}
	};
});
