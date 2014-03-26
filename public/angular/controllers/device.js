angular.module('e2eApp')
    .controller('DeviceController', function ($rootScope, $scope, $state,  $http, $cookies, $modal, channelService, userService, ownerService ) {
        var ownerId = $cookies.skynetuuid;
        var token = $cookies.skynettoken;
        //check if they are authenticated, if they arent signed in route them to login
        //TODO this will be handled by route checking at the root scope level. Should be changed then.
        if( ownerId === undefined || token === undefined ){
             $state.go('login');
        }
      $scope.hubName = '';
      $scope.addHub = function(){
            console.log('clicking Add Hub');
        };
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
    .controller('DeviceWizardController', function ($rootScope, $cookies, $scope, $state , GatewayService )

    {
        $scope.isopen = false;
//        $scope.hubName = undefined;

        $scope.wizardStates = {
            instructions: {
                name: 'instructions',
                id: 'connector.devices.wizard.instructions',
                title: 'Install a new Hub'
            },
            findhub: {
                name: 'findhub',
                id: 'connector.devices.wizard.findhub',
                title: 'Add Available Hub'
            }
        }

        $scope.availableGateways = [];
        GatewayService.get(function(data){
            if(data.gateways){
                $scope.availableGateways = _.filter(data.gateways, function(gateway){
                   return gateway.owner === undefined;
                });
            }
        });

        $scope.getNextState = function( ){
            return $scope.wizardStates.findhub.id;
        };

        $scope.canProceed = function(){

        };

        $scope.getPreviousState = function(){
            return $scope.wizardStates.instructions.id;
        };

        $scope.checkFinish = function(name, hub){
            console.log('checkFinish');
            if(name && name.trim().length > 0 && hub ){
              if($('#wizard-finish-btn').attr('disabled')){
                  $('#wizard-finish-btn').removeAttr('disabled');
              }
            } else {
                $('#wizard-finish-btn').attr('disabled', 'disabled');
            }
        };


        $scope.toggleOpen = function(){
            $scope.isopen = ! $scope.isopen;
        }
    })
    .controller('SubDeviceController',  function ($rootScope, $scope, $http, $injector, ownerService )
    {

    });
