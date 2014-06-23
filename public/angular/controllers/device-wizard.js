angular.module('octobluApp')
.controller('DeviceWizardController', function ( $scope, $state, currentUser, unclaimedDevices, deviceService) {

    $scope.getStateName = function(){
       return $state.current.name;
    };
    $scope.availableGateways = _.filter(unclaimedDevices, function (device) {
        return device.type === 'gateway';
    }) || [];

    $scope.isopen = false;
    $scope.user = currentUser;
    $scope.hubConfig = {};
    $scope.claimHub = function() {
            deviceService
                .claimDevice($scope.hubConfig.hub.uuid, currentUser.skynetuuid, currentUser.skynettoken, $scope.hubConfig.name)
                .then(function (result) {
                    //now update the name
                    return deviceService.updateDevice($scope.hubConfig.hub.uuid, currentUser.skynetuuid, currentUser.skynettoken, {
                       name: $scope.hubConfig.name
                    });
                }).then(function (device) {
                    console.log(device);
                    $state.go('connector.devices.all', {}, {reload: true});
                }, function (error) {
                    console.log(error);
                    $state.go('connector.devices.all', {}, {reload: true});
                });
    };

    $scope.toggleOpen = function () {
        $scope.isopen = !$scope.isopen;
    };
});