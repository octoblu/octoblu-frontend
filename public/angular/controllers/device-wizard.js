angular.module('octobluApp')
    .controller('DeviceWizardController', function ($scope, $state,currentUser, availableDeviceTypes,  unclaimedDevices, myDevices, deviceService) {
        $scope.getStateName = function () {
            return $state.current.name;
        };

        $scope.gateway = $state.params.claim === 'gateway';

        $scope.model = {
            deviceTypes : availableDeviceTypes,
            unclaimedDevices : _.filter(unclaimedDevices, function(device){
                //If we are selecting gateways, we only filter for gateways otherwise select all other devices.
                if($state.params.claim === 'gateway'){
                    return device.type === 'gateway';
                } else {
                    return device.type !== 'gateway';
                }
            }),
            claim : $state.params.claim
        };
        $scope.isopen = false;
        $scope.user = currentUser;
        $scope.claimDevice = function () {
            deviceService
                .claimDevice($scope.model.device.uuid)
                .then(function (result) {
                   var device = $scope.model.device;
                   return deviceService.updateDevice(device);
                }).then(function (result) {
                    console.log(result);
                    return deviceService.getDevices(true);
                }).then(function(){
                    $state.go('ob.connector.devices.all', {}, {reload : true});
                }, function (error) {
                    console.log(error);
                    $state.go('ob.connector.devices.all');
                });
        };

        $scope.toggleOpen = function () {
            $scope.isopen = !$scope.isopen;
        };
    });