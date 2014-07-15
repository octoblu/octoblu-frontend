'use strict';

angular.module('octobluApp')
    .controller('nodeWizardController', function($scope, $location, channelService, AuthService) {
      channelService.getDeviceTypes().then(function(deviceTypes){
        $scope.deviceTypes = deviceTypes;
      });
    });
