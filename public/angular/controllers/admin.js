'use strict';

angular.module('octobluApp')
    .controller('adminController', function ( $rootScope, $scope, $modal, $log,  $cookies, currentUser, allDevices, GroupService) {
        $scope.groupName = undefined;
        $scope.errors = [];
        $scope.user = currentUser;
        $scope.operatorGroup = _.findWhere($scope.user.groups, {"type" : "operators"});

        $scope.ownedDevices = allDevices;

        $scope.addGroup = function () {

            if ($scope.groupName) {
                GroupService.addGroup($scope.groupName, $cookies.skynetuuid, $cookies.skynettoken)
                    .then(function (group) {
                        $scope.user.groups = $scope.user.groups || [];
                        $scope.user.groups.push(group);
                        $scope.groupName = '';
                    },
                    function (errorResult) {
                        //TODO - Add notification errors to be displayed
                    });
            }
        };

        $scope.deleteGroup = function (group) {

           console.log('Deleting group');
           $rootScope.confirmModal($modal, $scope, $log,
               'Confirm Delete Group', 'Are you sure you want to delete ' + group.name + ' group?',
           function( ){
               var groupPromise = GroupService.deleteGroup($scope.user.skynetuuid, $scope.user.skynettoken, group.uuid );
               groupPromise.then(function(deletedGroup){
                   //filter the deleted group out of the list and set the user.groups
                   var groups = _.filter($scope.user.groups, function(group ){
                       return group.uuid != deletedGroup.uuid;
                   });
                   $scope.user.groups = groups;

               },function(result){
                   console.log(JSON.stringify(result));
               });
           },
           function(){

           });



        };

        $scope.getDeviceImageUrl = function (device) {
            if (device && device.type === 'gateway') {
                return '/assets/images/network_hub.png';
            }
            return '/assets/images/robot8.png';
        };

    })
    .controller('adminGroupDetailController', function ($scope, $stateParams, $cookies, currentUser, currentGroup, allDevices,  GroupService) {
        $scope.group = currentGroup;
        $scope.allDevices = allDevices;
        $scope.operators = _.findWhere($scope.user.groups, {'type' : 'operators'});


        $scope.isDeviceInGroup = function(device){
            var deviceIndex =  _.indexOf($scope.group.devices, { 'uuid' : device.uuid});
            return deviceIndex >= 0;
        }

        $scope.isMemberInGroup = function(member){
            var memberIndex =  _.indexOf($scope.group.members, { 'uuid': member.uuid});
            return memberIndex >= 0;

        };

        $scope.$watch('group', function(oldValue, newValue){
            if( newValue ){
                
                
            }

        });

        $scope.addMemberToGroup = function(member){
            var existingMember =  _.findWhere($scope.group.members, {'uuid' : member.uuid });
            if( ! existingMember ) {
              $scope.group.members.push(member);
            }
        };

        $scope.removeMemberFromGroup = function(member){
            var existingMember =  _.findWhere($scope.group.members, {'uuid' : member.uuid });
            if( existingMember ){
                var members = _.without($scope.group.members, existingMember);
                $scope.group.members = members;
            }
        };

        $scope.addDeviceToGroup = function(device){
           var existingDevice =  _.findWhere($scope.group.devices, {'uuid' : device.uuid });
            if( ! existingDevice ){
                $scope.group.devices.push({
                    'name' : device.name,
                    'uuid' : device.uuid,
                    'type' : device.type || 'custom'
                }); 
            }
        };

        $scope.removeDeviceFromGroup = function( device ){
            var existingDevice =  _.findWhere($scope.group.devices, {'uuid' : device.uuid });
            if( existingDevice ){
                var devices = _.without($scope.group.devices, existingDevice);
                $scope.group.devices = devices; 
            }
        };
//        $scope.user = currentUser;


    })
    .controller('invitationController', function ($rootScope, $cookies, $scope, InvitationService) {
        //Send the invitation
        $scope.recipientEmail = '';

        $scope.send = function () {

            var invitationPromise = InvitationService.sendInvitation({
                'uuid': $cookies.skynetuuid,
                'token': $cookies.skynettoken
            }, $scope.recipientEmail);

            invitationPromise.then(function (invitation) {

                /*
                 TODO Display a successful notification to the user. Use a notification, not a modal
                 */

            }, function (result) {
                /*
                 *TODO - Display an error notification to the user
                 */

            });

        };

    });