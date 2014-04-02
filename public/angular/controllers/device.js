angular.module('e2eApp')
    .controller('DeviceController', function ($rootScope, $scope, $log, $state,  $http, $cookies, $modal, channelService, ownerService, deviceService ) {

        var ownerId = $cookies.skynetuuid;
        var token = $cookies.skynettoken;

        $scope.socket = $rootScope.skynetSocket;
        //check if they are authenticated, if they arent signed in route them to login
        //TODO this will be handled by route checking at the root scope level. Should be changed then.
        if( ownerId === undefined || token === undefined ){
             $state.go('login');
        }

      $scope.deleteHub = function(hub){
          $rootScope.confirmModal($modal, $scope, $log, 'Delete Hub ' + hub.name ,'Are you sure you want to delete this Hub?',
              function() {
                  $log.info('ok clicked');
                  deviceService.deleteDevice(hub.uuid, hub.token, function( data ) {
                      var claimedGateways = $scope.claimedGateways;
                      $scope.claimedGateways = _.without(claimedGateways, hub);
                  });
              },
              function() {
                  $log.info('cancel clicked');
              });

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

      $scope.addSmartDevice = function(smartDevice){
        if(smartDevice.enabled){
            var subdeviceModal = $modal.open({
                templateUrl : 'pages/connector/devices/subdevice/add.html',
            scope : $scope,
                controller : 'AddSubDeviceController',
                backdrop : true,
                resolve : {
                    mode : function(){
                        return 'ADD';
                    },
                    hubs : function(){
                        return $scope.claimedGateways;
                    },
                    smartDevice : function(){
                        return smartDevice;
                    }

                }

            });

            subdeviceModal.result.then(function(subDeviceName, selectedHub, smartDevice, deviceOptions){
                $scope.socket.emit('gatewayConfig', {
                    "uuid": selectedHub.uuid,
                    "token": selectedHub.token,
                    "method": "createSubdevice",
                    "type": smartDevice.plugin,
                    "name": subDeviceName,
                    "options": deviceOptions
                }, function (addResult) {
                    console.log(addResult);
                });

                selectedHub.subdevices.push({
                    name : subDeviceName,
                    type : smartDevice.plugin,
                    options : deviceOptions
                });
            }, function(){

            });
        }
      }

        $scope.editSubDevice = function(subdevice, hub){
            var subdeviceModal = $modal.open({
                templateUrl : 'pages/connector/devices/subdevice/edit.html',
                controller : 'EditSubDeviceController',
                scope : $scope,
                backdrop : true,
                resolve : {
                    mode : function(){
                        return 'EDIT';
                    },

                    subdevice : function(){
                        return subdevice;
                    },

                    hub : function(){
                        return hub;
                    },
                    smartDevices : function(){
                        return $scope.smartDevices;
                    },
                    plugins : function(){
                        return hub.plugins;
                    }

                }

            });

            subdeviceModal.result.then(function(subDevice, Hub, deviceOptions){
                $scope.socket.emit('gatewayConfig', {
                    "uuid": Hub.uuid,
                    "token": Hub.token,
                    "method": "updateSubdevice",
                    "type": subDevice.type,
                    "name": subDevice.name,
                    "options": deviceOptions
                }, function (updateResult) {
                    console.log(updateResult);
                });
                subdevice.options = deviceOptions;
            }, function(){

            });

        }

        $scope.deleteSubDevice = function(subdevice, hub){
            $rootScope.confirmModal($modal, $scope, $log,
                    'Delete Subdevice' + subdevice.name ,
                    'Are you sure you want to delete' + subdevice.name + ' attached to ' + hub.name + ' ?',
                function() {
                    $log.info('ok clicked');
                    $rootScope.skynetSocket.emit('gatewayConfig', {
                        "uuid": hub.uuid,
                        "token": hub.token,
                        "method": "deleteSubdevice",
                        "name": subdevice.name
                        // "name": $scope.gateways[parent].subdevices[idx].name
                    }, function (deleteResult) {
                        if(deleteResult.result === 'ok'){
                            hub.subdevices = _.without(hub.subdevices, subdevice);

                        }

                    });
                },
                function() {
                    $log.info('cancel clicked');
                });
        }

        $scope.getSubDeviceLogo = function(subdevice){
            var smartDevice = _.findWhere($scope.smartDevices, {
                plugin : subdevice.type
            });

            if(smartDevice){
                return smartDevice.logo;
            }
            return 'assets/images/robots/robot5.png';
        };


    } )

    .controller('DeviceWizardController', function ($rootScope, $cookies, $scope,  $state , deviceService, GatewayService )

    {


        $scope.isopen = false;
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

        $scope.getNextState = function(){
            return $scope.wizardStates.findhub.id;
        };

        $scope.getPreviousState = function( ){
            return $scope.wizardStates.instructions.id;
        };

        $scope.canClaim = function(name, hub){
            console.log('checkFinish');
            if(name && name.trim().length > 0 && hub ){
                return true;
            }
            return false;
        };
        //Function to enable or disable the Finish and Claim Hub buttons
        $scope.checkClaim = function(name, hub){
            if($scope.canClaim(name, hub)){
                $('#wizard-finish-btn').removeAttr('disabled');
                $('#wizard-claim-btn').removeAttr('disabled');
            } else {
                $('#wizard-finish-btn').attr('disabled');
                $('#wizard-claim-btn').attr('disabled');
            }
        }

        //Notify the parent scope that a new hub has been selected
        $scope.notifyHubSelected = function(hub){
            console.log('hub selected notifying parent scope');
            $scope.$emit('hubSelected', hub);
        };

        //Notify the parent scope that the hub name has been changed
        $scope.notifyHubNameChanged = function(name){
            console.log('name changed notifying parent scope');
            $scope.$emit('hubNameChanged', name);
        }

        //event handler for updating the hubName selected in the child scope
        $scope.$on('hubNameChanged', function(event, name){

            $scope.hubName = name;
        });

        //event handler for updating the hub selected in the child scope.
        $scope.$on('hubSelected', function(event, hub){

            $scope.selectedHub = hub;
        });

        $scope.saveHub = function(hub, hubName){
           if(hub && hubName && hubName.trim().length > 0 ){

               var hubData =
               {
                   uuid : hub.uuid,
                   token : hub.token,
                   owner : $cookies.skynetuuid,
                   name  : hubName,
                   keyvals : []

               };

                 $http.put('/api/devices/' + $cookies.skynetuuid , hubData)
                     .success(function(data){
                         console.log('success');
                         console.log('Data returned ' + data);
                     $state.go('connector.devices', {}, {
                         reload : true
                     }) ;

                })
                 .error(function(data){
                         console.log('error');
                         console.log(data);
                 } );

           }
        } ;

        $scope.toggleOpen = function(){
            $scope.isopen = ! $scope.isopen;
        };
    })
  ;
