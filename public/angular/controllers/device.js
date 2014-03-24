angular.module('e2eApp')
    .controller('DeviceController', function ($rootScope, $scope, $state,  $http, $cookies, $modal, channelService, userService, ownerService ) {
        var ownerId = $cookies.skynetuuid;
        var token = $cookies.skynettoken;
        //check if they are authenticated, if they arent signed in route them to login
        //TODO this will be handled by route checking at the root scope level. Should be changed then.
        if( ownerId === undefined || token === undefined ){
             $state.go('login');
        }

      ownerService.getGateways(ownerId, token, false, function(error, data){
            if(error || data.gateways === undefined ){
                console.log(error);
                $scope.claimedGateways = [];
            } else{
                $scope.claimedGateways = _.filter(data.gateways, function(gateway){
                    return gateway.owner === ownerId;
                });
            }
      });

        channelService.getSmartDevices(function(error, data){
             if(error){
                 console.log('Error: ' + error);
             }
            $scope.smartDevices = data;
        });
    } )
    .controller('DeviceWizardController', function ($rootScope, $cookies, $scope, $state, $modalInstance,  ownerService )

    {

        ownerService.getGateways($cookies.skynetuuid, $cookies.skynettoken, false, function(error, data){
            if(error || data.gateways === undefined ){
                console.log(error);
                $scope.availableHubs = [];
            } else{
                $scope.availableHubs = _.filter(data.gateways, function(gateway){
                    return ! gateway.hasOwnProperty("owner");
                });
                console.log($scope.availableHubs);
            }
        });

        $scope.isopen = false;

        $scope.wizardStates = {
            instructions : 'connector.devices.wizard.instructions',
            findhubs : 'connector.devices.wizard.findhub'
        };

        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                console.log(toState);
                console.log(fromState);
               //event.preventDefault();
                // transitionTo() promise will be rejected with
                // a 'transition prevented' error
            });
        //If we have first opened the wizard then we check if there are available
        $rootScope.$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams){
                event.preventDefault();
                if(toState.name === 'connector.devices.wizard'){
                    if($scope.availableHubs === undefined || $scope.availableHubs.length == 0){
                        $state.transitionTo($scope.wizardStates.instructions);
                    } else {
                        $state.transitionTo($scope.wizardStates.findhubs);
                    }
                 }
            });

        $scope.next = function(){
            if($state.is($scope.wizardStates.instructions)){
                $state.transitionTo($scope.wizardStates.findhubs);
            }
        };

//        $scope.on('$stateChangeStart', function());

        $scope.previous = function(){
            if($state.is($scope.wizardStates.findhubs)){
                $state.transitionTo($scope.wizardStates.instructions);
            }

        };

        $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
            $state.transitionTo('connector.devices');
        };

})
    .controller('SubDeviceController',  function ($rootScope, $scope, $http, $injector, ownerService )
    {

    });
