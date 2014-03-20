angular.module('e2eApp')
    .controller('DeviceController', function ($rootScope, $scope, $state,  $http, $cookies, $modal, userService, ownerService ) {
        var ownerId = $cookies.skynetuuid;
        var token = $cookies.skynettoken;
        //check if they are authenticated, if they arent signed in route them to login
        //TODO this will be handled by route checking at the root scope level. Should be changed then.
        if( ownerId === undefined || token === undefined ){
             $state.go('login');
        }

      $scope.gateways = [];

      $scope.addNewHub = function(){
          console.log('clicking add new hub');
          var modalInstance =  $modal.open({
              templateUrl: 'pages/connector/devices/wizard/index.html',
              backdrop : 'static',
              scope : this,
              keyboard : false,
              controller: 'DeviceWizardController',
              resolve: {

                  }
              });



      };



    } )
    .controller('DeviceWizardController', function ($rootScope, $scope, $modalInstance  )

    {
        $scope.states = [

            {
                "name" : "instructions"

            } ,

            {
                "name" : "find-hub"
            },
            {
                "name" : "edit-hub"
            }
        ] ;

        $scope.currentState = $scope.states[0];

        $scope.next = function( state ){
           var stateIndex =  _.indexOf($scope.states, state);
           if(stateIndex == $scope.states.length - 1){
               $("wizard-next-btn").attr('disabled', true);
           } else {
               $("wizard-next-btn").attr('disabled', false);
               $scope.currentState = $scope.states[stateIndex + 1];
           }
        };

        $scope.previous = function(state){
            var stateIndex =  _.indexOf($scope.states, state);
            if(stateIndex == 0){
                $("wizard-previous-btn").attr('disabled', true);
            } else {
                $('wizard-previous-btn').attr('disabled', false);
                $scope.currentState = $scope.states[stateIndex - 1];
            }
        };

        $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

})
    .controller('SubDeviceController',  function ($rootScope, $scope, $http, $injector, ownerService )
    {

    });
