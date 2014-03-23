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

//      $scope.addNewHub = function(){
//          console.log('clicking add new hub');
//          var modalInstance =  $modal.open({
//              templateUrl: 'pages/connector/devices/wizard/index.html',
//              backdrop : 'static',
//              scope : $scope,
//              keyboard : false,
//              controller: 'DeviceWizardController',
//              resolve: {
//                  }
//              });
//
//
//
//      };



    } )
    .controller('DeviceWizardController', function ($rootScope, $cookies, $scope, $state, $modalInstance, ownerService  )

    {
        var ownerId = $cookies.skynetuuid;
        var token = $cookies.skynettoken;

        ownerService.getGateways(ownerId, token, false, function(error, data){
            if(error || data.gateways === undefined ){
                console.log(error);
                $scope.availableGateways = [];
            } else{
                $scope.availableGateways = _.filter(data.gateways, function(gateway){
                    return gateway.owner === undefined;
                });
            }
        });

//        $scope.states = [
//
//            {
//                "name" : "instructions",
//                "title" : "Install Instructions",
//                "valid" : true
//            } ,
//
//            {
//                "name" : "find-hub",
//                "title" : "Locate Available Hubs",
//                "valid": false
//            },
//            {
//                "name" : "edit-hub",
//                "title" : "Edit Claimed Hub",
//                "valid" : false
//            }
//        ] ;
//
//        $scope.currentState = $scope.states[0];

        $scope.next = function(){
//           var stateIndex =  _.indexOf($scope.states, state);
//           if(stateIndex == $scope.states.length - 1){
//               $("wizard-next-btn").attr('disabled', true);
//           } else {
//               $("wizard-next-btn").attr('disabled', false);
//               $scope.currentState = $scope.states[stateIndex + 1];
//           }
        };

        $scope.previous = function(state){
//            var stateIndex =  _.indexOf($scope.states, state);
//            if(stateIndex == 0){
//                $("wizard-previous-btn").attr('disabled', true);
//            } else {
//                $('wizard-previous-btn').attr('disabled', false);
//                $scope.currentState = $scope.states[stateIndex - 1];
//            }
        };

        $scope.ok = function () {
            //
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

})
    .controller('SubDeviceController',  function ($rootScope, $scope, $http, $injector, ownerService )
    {

    });
