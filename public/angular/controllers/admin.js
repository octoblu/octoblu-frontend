'use strict';

angular.module('octobluApp')
    .controller('adminController', function($rootScope, $scope, $q, $cookies, $state, ownerService, userService, GroupService ) {
        $scope.groupName = undefined;
        $scope.errors = [];
        $scope.user;

        $scope.userPromise = userService.getCurrentUser();
        //Get the information for the currently logged in user and get their owned devices
        $scope.userPromise
            .then(function(user){
                $scope.user = user;
                return GroupService.getAllDevices($cookies.skynetuuid, $cookies.skynettoken );
            })
            .then(function(devices){
                $scope.user.ownedDevices = devices;
            }, function(result){
                console.log(JSON.stringify(result));
            });

        $scope.addGroup = function(){

            if($scope.groupName && $scope.groupName.trim().length > 0){
                var promise = GroupService.addGroup($scope.groupName, $cookies.skynetuuid, $cookies.skynettoken );
                promise.then(function(group){
                        if( ! $scope.user.groups ){
                            $scope.user.groups = [];
                        }
                        $scope.user.groups.push(group);
                    },
                    function( errorResult ){
                        //TODO - Add notification errors to be displayed
                    });
            }
        };

        $scope.deleteGroup = function(group){


        };

        $scope.getDeviceImageUrl = function(device){
            if(device && device.type === 'gateway' ){
                return '/assets/images/network_hub.png';
            }
            return '/assets/images/robot8.png';
        };

    })
    .controller('adminGroupDetailController', function($rootScope, $scope, $stateParams, $state, $cookies, ownerService, userService,  GroupService) {

        var userPromise = $scope.userPromise;
        $scope.groupPromise = GroupService.getGroup($cookies.skynetuuid, $cookies.skynettoken, $stateParams.uuid );


    })
    .controller('invitationController', function($rootScope, $cookies, $scope, InvitationService ) {
        //Send the invitation
        $scope.recipientEmail = '';

        $scope.send = function( ){

            var invitationPromise = InvitationService.sendInvitation({
                'uuid' : $cookies.skynetuuid,
                'token' : $cookies.skynettoken
            }, $scope.recipientEmail );

            invitationPromise.then(function(invitation){
                /*
                  TODO Display a successful notification to the user. Use a notification, not a modal
                 */

            }, function(result){
                /*
                 *TODO - Display an error notification to the user
                 */

            });

        };

    });