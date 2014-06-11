angular.module('octobluApp')
    .controller('DeviceController', function ($rootScope, $scope, $q, $log, $state,  $http, $cookies, $modal, $timeout, currentUser, claimedGateways, smartDevices, ownerService, deviceService ) {

//        var ownerId = $cookies.skynetuuid;
//        var token = $cookies.skynettoken;

        $scope.smartDevices = smartDevices;
        $scope.claimedGateways = claimedGateways;

//        $scope.socket = $rootScope.skynetSocket;
//        //TODO this will be handled by route checking at the root scope level. Should be changed then.
//        if( ownerId === undefined || token === undefined ){
//             $state.go('login');
//        }

        //Event handlers to detect edit and delete subdevice calls  from the device carousel directive
        //TODO - this may need to be refactored into a more elegant solution
        $scope.$on('editSubDevice', function(event, subdevice, hub){
            $scope.editSubDevice(subdevice, hub);
        });

        $scope.$on('deleteSubDevice', function(event, subdevice, hub){
            $scope.deleteSubDevice(subdevice, hub);
        });

        $scope.saveHubName = function(hub){
            var elementSelector = '#' + hub.uuid;
            var hubNameField = $(elementSelector).find('input[name="hub-name"]');
            hubNameField.attr('readonly' , 'readonly');

            var errors = $scope.validateName(hub);
            if(errors.length > 0 ){
                hub.validationErrors = errors;
            } else {
                var hubData = {
                    uuid : hub.uuid,
                    owner : hub.owner,
                    name : hub.name,
                    token : hub.token,
                    keyvals : [{}]
                }

                deviceService.updateDevice(hub.owner, hubData, function( data ){
                    console.log(JSON.stringify(data));

                } ) ;
                hub.isNameEditable = false;
            }
        };

        $scope.toggleNameEditable = function( hub ){
            var elementSelector = '#' + hub.uuid;
            var hubNameField = $(elementSelector).find('input[name="hub-name"]');
            hubNameField.removeAttr('readonly');
        };

        $scope.validateName = function(hub){
            var errors = [];
            if(hub.name === undefined || hub.name.length === 0){
                errors.push(
                    {
                        type : 'danger',
                        summary : 'Missing Name',
                        msg : 'Hub Name is required. Please enter a valid name for Hub.'
                    }
                )
            }
            var duplicateHubs = _.findWhere(hub.subdevices, {'name' : hub.name });

            if(duplicateHubs && duplicateHubs.count > 1){
                errors.push({
                    type: 'danger',
                    summary: 'Duplicate Hub Name',
                    msg: 'Please enter a unique name for the Hub'
                });
            }
            return errors;
        };

        $scope.deleteHub = function(hub){
          $rootScope.confirmModal($modal, $scope, $log, 'Delete Hub ' + hub.name ,'Are you sure you want to delete this Hub?',
              function() {
                  $log.info('ok clicked');
                  deviceService.deleteDevice(hub.uuid, { skynetuuid : currentUser.skynetuuid, skynettoken : currentUser.skynettoken }, function( error, data ) {
                      if(! error){
                          var claimedGateways = $scope.claimedGateways;
                          $scope.claimedGateways = _.without(claimedGateways, hub);
                      }
                  });
              },
              function() {
                  $log.info('cancel clicked');
              });

      };

      $scope.addSmartDevice = function(smartDevice ){
          if (smartDevice.enabled) {

              var subdeviceModal = $modal.open({
                  templateUrl: 'pages/connector/devices/subdevice/add.html',
                  controller: 'AddSubDeviceController',
                  backdrop: true,
                  resolve: {
                      mode: function () {
                          return 'ADD';
                      },
                      hubs: function () {
                          return $scope.gateways;
                      },
                      smartDevice: function () {
                          return smartDevice;
                      },
                      selectedHub : function(){
                         return null;
                      }
                  }

              });

              subdeviceModal.result.then(function (result) {
                  $rootScope.skynetSocket.emit('gatewayConfig', {
                      "uuid": result.hub.uuid,
                      "token": result.hub.token,
                      "method": "createSubdevice",
                      "type": result.device.plugin,
                      "name": result.name,
                      "options": result.options
                  }, function (addResult) {
                      console.log(addResult);
                  });

                  result.hub.subdevices.push({
                      name: result.name,
                      type: result.device.plugin,
                      options: result.options
                  });
              }, function () {

              });
          }
      }




    } )
    .controller('DeviceEditController', function ($rootScope, $cookies, $scope,  $state , $stateParams, $http,  currentUser,  deviceService ){

        $scope.editSubDevice = function(subdevice, hub){

            /*
             TODO
             * Check if the sub device is installed for the current hub
             * install the sub device refresh the current device to get the list of updated plugins installed
             * pass the installed plugin for the sub-device to the modal to the modal
             *
             */
            var subDeviceModal = $modal.open({
                templateUrl : 'pages/connector/devices/subdevice/edit.html',
                controller : 'EditSubDeviceController',
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

            subDeviceModal.result.then(function( options){
                $rootScope.skynetSocket.emit('gatewayConfig', {
                    "uuid": hub.uuid,
                    "token": hub.token,
                    "method": "updateSubdevice",
                    "type": subdevice.type,
                    "name": subdevice.name,
                    "options": options
                }, function (updateResult) {
                    console.log(updateResult);
                });
                subdevice.options = options;
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
                        },
                        function (deleteResult) {
                            if(deleteResult.result === 'ok'){
                                hub.subdevices = _.without(hub.subdevices, subdevice);
                            }
                        });
                });
        };

    })
    .controller('DeviceDetailController', function($scope, $state, $stateParams, currentUser, myDevices, PermissionsService){
        $scope.device = _.findWhere(myDevices, { uuid: $stateParams.uuid });
        PermissionsService
            .allSourcePermissions(currentUser.skynetuuid, currentUser.skynettoken, $scope.device.resource.uuid)
            .then(function(permissions){
                $scope.sourcePermissions = permissions;
            });
         PermissionsService
            .allTargetPermissions(currentUser.skynetuuid, currentUser.skynettoken, $scope.device.resource.uuid)
            .then(function(permissions){
                $scope.targetPermissions = permissions;
            });
        console.log($scope.device);
    })
    .controller('DeviceWizardController', function ($rootScope, $cookies, $scope,  $state , $http,  currentUser,  deviceService )

    {
        $scope.availableGateways;

        deviceService.getUnclaimedDevices(currentUser.skynetuuid, currentUser.skynettoken)
            .then(function(data){
                $scope.availableGateways = data;
                $scope.$apply();
        }, function(error){
                console.log(error);
                $scope.availableGateways = [];
                $scope.$apply();
        });

        $scope.isopen = false;
        $scope.user = currentUser;

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
        };




        $scope.getNextState = function(){
            return $scope.wizardStates.findhub.id;
        };

        $scope.getPreviousState = function( ){
            return $scope.wizardStates.instructions.id;
        };

        $scope.canClaim = function(name, hub){
//            console.log('checkFinish');
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

              var devicePromise =  deviceService
                  .claimDevice(hub.uuid,
                  {
                      skynetuuid : currentUser.skynetuuid,
                      skynettoken : currentUser.skynettoken
                  },
                  hubName );

               devicePromise.then(function(result){
                   $state.go('connector.devices.all', {}, {reload: true});
               }, function(error){
               });

           }
        } ;

        $scope.toggleOpen = function(){
            $scope.isopen = ! $scope.isopen;
        };

    })
  ;
