angular.module('octobluApp')
    .controller('DeviceWizardController', function ($scope, $state,currentUser, availableDeviceTypes,  unclaimedDevices, myDevices,  skynetService, deviceService) {




        $scope.getStateName = function () {
            return $state.current.name;
        };

        if($state.params.claim === 'gateway'){
            $scope.gateway=true;
        } else {
            $scope.gateway=false;
        }

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

//            skynetService.claimDevice($scope.model.device)
//                .then(function(skynetResult){
//                    console.log(skynetResult);
//                    return skynetResult;
//                })
//                .then(function(claimResult){
//                    console.log('Device updated');
//                    return deviceService.getDevices(true)
//                }).then(function(devices){
//                    console.log('fetched all devices');
//                    $state.go('ob.connector.devices.all', {}, {reload : true });
//                });

            deviceService
                .claimDevice($scope.model.device.uuid)
                .then(function (result) {
                    //now update the name
                    return deviceService.updateDevice($scope.model.device.uuid, { name: $scope.model.device.name });
                }).then(function (device) {
                    return  deviceService.getDevices(true);
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