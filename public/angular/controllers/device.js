angular.module('octobluApp')
    .controller('DeviceController', function ($rootScope, $scope, $q, $log, $state,  $http, $cookies, $modal, $timeout, currentUser, myDevices, smartDevices, deviceService ) {

        $scope.user = currentUser;
        $scope.smartDevices = smartDevices;
        $scope.devices = myDevices;

        $scope.deleteDevice = function(device){
          $rootScope.confirmModal($modal, $scope, $log, 'Delete Device ' + device.name ,'Are you sure you want to delete this Device?',
              function() {
                  deviceService.deleteDevice(device.uuid, currentUser.skynetuuid, currentUser.skynettoken)
                      .then(function(deletedDevice){
                          if(deletedDevice){
                              $scope.devices =  _.without($scope.devices, device );
                          }
                      }, function(error){
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
                      hubs : function(){
                         return _.filter($scope.devices, function(device){
                             return device.type === 'gateway';
                         } ) ;
                      }, 
                      smartDevice: function () {
                          return smartDevice;
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
            .flatSourcePermissions(currentUser.skynetuuid, currentUser.skynettoken, $scope.device.resource.uuid)
            .then(function(permissions){
                $scope.sourceGroups = _.uniq(permissions, function(permission){
                    return permission.uuid;
                });
            });

        PermissionsService
            .flatTargetPermissions(currentUser.skynetuuid, currentUser.skynettoken, $scope.device.resource.uuid)
            .then(function(permissions){
                $scope.targetGroups = _.uniq(permissions, function(permission){
                    return permission.uuid;
                });
             });

        PermissionsService
            .allTargetPermissions(currentUser.skynetuuid, currentUser.skynettoken, $scope.device.resource.uuid)
            .then(function(permissions){
                $scope.targetPermissions = permissions;
             });
        console.log($scope.device);
    })
    .controller('DeviceWizardController', function ($rootScope, $cookies, $scope,  $state , $http,  currentUser, unclaimedDevices,  deviceService )

    {

//        $scope.hubName;

        $scope.availableGateways = _.filter(unclaimedDevices, function(device){
            return device.type === 'gateway';
        }) || [];


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




//        $scope.getNextState = function(){
//            return $scope.wizardStates.findhub.id;
//        };
//
//        $scope.getPreviousState = function( ){
//            return $scope.wizardStates.instructions.id;
//        };

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
//        $scope.notifyHubSelected = function(hub){
//            console.log('hub selected notifying parent scope');
//            $scope.$emit('hubSelected', hub);
//        };

        //Notify the parent scope that the hub name has been changed
//        $scope.notifyHubNameChanged = function(name){
//            $scope.$emit('hubNameChanged', name);
//        }

        //event handler for updating the hubName selected in the child scope
//        $scope.$on('hubNameChanged', function(event, name){
//
//            $scope.hubName = name;
//        });

        //event handler for updating the hub selected in the child scope.
//        $scope.$on('hubSelected', function(event, hub){
//
//            $scope.selectedHub = hub;
//        });

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
