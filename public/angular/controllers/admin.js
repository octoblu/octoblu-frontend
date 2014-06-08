'use strict';

angular.module('octobluApp')
    .controller('adminController', function ($rootScope, $scope, $modal, $log, $cookies, currentUser, allDevices,  GroupService) {
        $scope.groupName = undefined;
        $scope.errors = [];
        $scope.user = currentUser;
        $scope.allDevices = allDevices;

       GroupService.getAllGroups(currentUser.skynetuuid, currentUser.skynettoken)
           .then(function(groups){
            $scope.allGroups = groups || [];
            $scope.operatorsGroup = _.findWhere(groups, {'type' : 'operators'}) || {};
            $scope.allResources = _.union(_.pluck($scope.allDevices, 'resource'), $scope.operatorsGroup.members);
            $scope.$broadcast('groupsRetrieved', $scope.allGroups, $scope.operatorsGroup, $scope.allResources);
       }, function(error){
           console.log(error);
           $scope.allGroups = [];

       });


        $scope.ownedDevices = allDevices;

        $scope.$on('groupUpdated', function(event, updatedGroup){
           var existingGroup =  _.findWhere($scope.user.groups, {uuid : updatedGroup.uuid});
           var groupIndex = _.indexOf($scope.user.groups, existingGroup );
           $scope.user.groups[groupIndex] = updatedGroup;

        });

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
                function () {
                    var groupPromise = GroupService.deleteGroup($scope.user.skynetuuid, $scope.user.skynettoken, group.uuid);
                    groupPromise.then(function (deletedGroup) {
                        //filter the deleted group out of the list and set the user.groups
                        var groups = _.filter($scope.user.groups, function (group) {
                            return group.uuid != deletedGroup.uuid;
                        });
                        $scope.user.groups = groups;

                    }, function (result) {
                        console.log(JSON.stringify(result));
                    });
                },
                function () {

                });


        };

        $scope.getUsersInGroup = function(group){
            var users = _.find(group.members, { 'type' : 'user'}) || [];
            return users;
        };

        $scope.getDevicesInGroup = function(group){
            var devices = _.find(group.members, { 'type' : 'device'}) || []; 
            return devices; 
        };
        
        $scope.getDeviceImageUrl = function (device) {
            if (device && device.type === 'gateway') {
                return '/assets/images/network_hub.png';
            }
            return '/assets/images/robot8.png';
        };

    })
    .controller('adminGroupDetailController', function ($scope, $stateParams, $cookies, currentUser, currentGroup, GroupService) {

        $scope.group = currentGroup;

        $scope.$on('groupsRetrieved', function(event, allGroups, operatorsGroup, resources){
            $scope.allGroups = allGroups;

            $scope.sourcePermissionsGroup = _.findWhere(allGroups, {
                'type' : 'permissions',
                'name' : $scope.group.uuid + '_sources'
            });

            $scope.targetPermissionsGroup = _.findWhere(allGroups, {
                'type' : 'permissions',
                'name' : $scope.group.uuid + '_targets'
            });

            $scope.operatorsGroup = operatorsGroup;
            $scope.allResources = resources;

            event.preventDefault();
        });

        $scope.$watchCollection('group.members', function(newValue, oldValue, scope){
            console.log('group udpated');
            if(newValue && oldValue ){
                if(newValue.length != oldValue.length ){


                }
            }
        }, true);

        $scope.$watch('resourcePermission', function(newValue, oldValue, scope){
            console.log('resourecePermission udpated');
            if(newValue && oldValue){
                //persist the resource permission to the backend.
            }

        }, true);


        $scope.$watchCollection('sourcePermissionsGroup.members', function(newValue, oldValue, scope){
            console.log('sourcePermissionsGroup udpated');
            if(newValue && oldValue ){
                if(newValue.length != oldValue.length ){

                }
            }
        }, true);

        $scope.$watchCollection('targetPermissionsGroup.members', function(newValue, oldValue, scope){

            if(newValue && oldValue ){
                if(newValue.length != oldValue.length ){

                }
            }
        }, true);


        GroupService.getGroup(currentUser.skynetuuid, currentUser.skynettoken, $stateParams.uuid)
        .then(function(group){
                $scope.group = group;

        }, function(error){
                $scope.group  = undefined;
        });

        GroupService.getResourcePermission($stateParams.uuid, currentUser).then(function(grpResourcePermission){
            $scope.resourcePermission = grpResourcePermission;
        }, function(error){
            $scope.resourcePermission = {};
        });


        $scope.removeResourceFromTargetPermissionsGroup = function (resource) {
            var existingTargetPermissionsResource = _.findWhere($scope.targetPermissionsGroup.members, {uuid : resource.uuid });
            if( existingTargetPermissionsResource ){
                $scope.sourcePermissionsGroup.members = _.without($scope.sourcePermissionsGroup.members,
                    _.findWhere($scope.sourcePermissionsGroup.members,
                        { uuid : resource.uuid }));
                var existingSourcePermissionsGroupMember = _.findWhere($scope.sourcePermissionsGroup.members, resource);
                //If the resource is not in the source permissions group, you should remove it from members list in the parent group
                if( ! existingSourcePermissionsGroupMember){
                   $scope.group.members =  _.without($scope.group.members, 
                                                    _.findWhere($scope.group.members,
                                                                { uuid : resource.uuid })
                                            );
                }
            }
        };

        /*
           removeResourceFromSourcePermissionsGroup
           check if the resource 
         */
        $scope.removeResourceFromSourcePermissionsGroup = function (resource) {
            var existingSourcePermissionsResource = _.findWhere($scope.sourcePermissionsGroup.members, {uuid : resource.uuid });
            if( existingSourcePermissionsResource ){
                $scope.sourcePermissionsGroup.members = _.without($scope.sourcePermissionsGroup.members,
                                                                    _.findWhere($scope.sourcePermissionsGroup.members, 
                                                                        { uuid : resource.uuid }));
                var existingTargetGroupMember = _.findWhere($scope.targetPermissionsGroup.members, {uuid : resource.uuid });
                //If the resource is not in the target group, you should remove it from the parent group
                if( ! existingTargetGroupMember){
                    _.without($scope.group.members, _.findWhere($scope.group.members, { uuid : resource.uuid }) );
                }
            }
        };

        $scope.addResourceToTargetPermissionsGroup = function (resource) {
            var existingPermissionsResource = _.findWhere($scope.targetPermissionsGroup.members, resource);
            if( ! existingPermissionsResource ){
                $scope.targetPermissionsGroup.members.push(resource);
                var existingGroupMember = _.findWhere($scope.group.members, resource);
                if( ! existingGroupMember){
                    $scope.group.members.push(resource);
                }
            }
        };

        $scope.addResourceToSourcePermissionsGroup = function (resource) {
            var existingPermissionsResource = _.findWhere($scope.sourcePermissionsGroup.members, resource);
            if( ! existingPermissionsResource ){
                $scope.sourcePermissionsGroup.members.push(resource);
                var existingGroupMember = _.findWhere($scope.group.members, resource);
                if( ! existingGroupMember){
                    $scope.group.members.push(resource);
                }
            }
        };

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