'use strict';

angular.module('octobluApp')
    .controller('adminController', function (allGroupResourcePermissions, $scope, $modal, currentUser, allDevices, operatorsGroup, GroupService, PermissionsService) {
        $scope.user = currentUser;
        $scope.allDevices = allDevices;
        $scope.allGroupResourcePermissions = allGroupResourcePermissions;
        $scope.ownedDevices = allDevices;
        $scope.operatorsGroup = operatorsGroup;
        $scope.allResources = _.union(operatorsGroup.members,
            _.pluck(allDevices, 'resource'));

        $scope.addResourcePermission = function () {
            if ($scope.resourcePermissionName) {
                var resourcePermission;

                PermissionsService.add(currentUser.skynetuuid, currentUser.skynettoken, { name: $scope.resourcePermissionName })
                    .then(function (newResourcePermission) {
                        resourcePermission = newResourcePermission;
                        $scope.allGroupResourcePermissions.push(resourcePermission);
                        return resourcePermission;
                    })
                    .then(function (resourcePermission) {
                        return GroupService.addGroup(resourcePermission.resource.uuid + '_sources', currentUser.skynetuuid, currentUser.skynettoken);
                    })
                    .then(function (sourceGroup) {
                        resourcePermission.source = sourceGroup.resource;
                        return GroupService.addGroup(resourcePermission.resource.uuid + '_targets', currentUser.skynetuuid, currentUser.skynettoken);
                    })
                    .then(function (targetGroup) {
                        resourcePermission.target = targetGroup.resource;
                        return PermissionsService.update(currentUser.skynetuuid, currentUser.skynettoken, resourcePermission);
                    })
                    .then(function(updatedResourcePermission){
                        angular.copy(updatedResourcePermission, resourcePermission);
                    });
            }
        };

        $scope.deleteResourcePermission = function (resourcePermission) {
            $rootScope.confirmModal($modal, $scope, $log,
                'Confirm Delete Group', 'Are you sure you want to delete ' + resourcePermission.name + ' group?',
                function () {
                    PermissionsService.delete(currentUser.skynetuuid, currentUser.skynettoken, resourcePermission.resource.uuid)
                        .then(function(){
                            var index=$scope.allGroupResourcePermissions.indexOf(resourcePermission);
                            $scope.allGroupResourcePermissions.splice(index,1);
                        });
                });
        };

        $scope.getDeviceImageUrl = function (device) {
            if (device && device.type === 'gateway') {
                return '/assets/images/network_hub.png';
            }
            return '/assets/images/robot8.png';
        };
    })
    .controller('adminGroupDetailController', function ($scope, PermissionsService, $stateParams, resourcePermission, sourcePermissionsGroup, targetPermissionsGroup) {
        $scope.resourcePermission = resourcePermission;
        $scope.sourcePermissionsGroup = sourcePermissionsGroup;
        $scope.targetPermissionsGroup = targetPermissionsGroup;

        $scope.$watch('resourcePermission.permissions', function (newValue, oldValue) {
            if (newValue && oldValue && !angular.equals(newValue, oldValue)) {
                PermissionsService.update(
                    $scope.user.skynetuuid,
                    $scope.user.skynettoken,
                    $scope.resourcePermission
                ).then(function (updatedResourcePermission) {
                        console.log('resource permission saved');
                        console.log(updatedResourcePermission);
                        angular.copy(updatedResourcePermission, $scope.resourcePermission);
                    }, function (error) {
                        console.log('error saving resource permission');
                        console.log(error);

                    });
            }
        }, true);


        $scope.$watchCollection('sourcePermissionsGroup.members', function (newValue, oldValue, scope) {
            console.log('sourcePermissionsGroup changed');
//            if (newValue && oldValue) {
//                console.log('sourcePermissionsGroup udpated');
//                if (newValue.length != oldValue.length) {
//                    var groupPromise = GroupService.updateGroup(scope.user.skynetuuid, scope.user.skynettoken, scope.sourcePermissionsGroup);
//
//                    groupPromise.then(function (updatedGroup) {
//                        scope.sourcePermissionsGroup = updatedGroup;
//                        console.log('sourcePermissionsGroup has been saved');
//
//                    }, function (error) {
//
//                    });
//                }
//            }
        }, true);

        $scope.$watchCollection('targetPermissionsGroup.members', function (newValue, oldValue) {
            console.log('targetPermissionsGroup changed');
//            if (newValue && oldValue) {
//                if (newValue.length != oldValue.length) {
//                    var groupPromise = GroupService.updateGroup($scope.user.skynetuuid, $scope.user.skynettoken, $scope.targetPermissionsGroup);
//                    groupPromise.then(function (updatedGroup) {
//                        $scope.targetPermissionsGroup = updatedGroup;
//                    }, function (error) {
//
//                    });
//                }
//            }
        }, true);

        $scope.removeResourceFromGroup = function (group, resource) {
                group.members = _.filter(group.members, function(member){
                    return member.uuid !== resource.uuid;
                });
        };

        $scope.addResourceToGroup = function (group, resource) {
            var resourcePermissionIndex = _.findWhere(group.members, {uuid: resource.uuid});

            if (!resourcePermissionIndex) {
                group.members.push(resource);
            }
        };

    })
    .controller('invitationController', function ($rootScope, $cookies, $scope, userService, InvitationService) {
        //Send the invitation
        $scope.recipientEmail = '';

        $scope.send = function () {

            var invitationPromise = InvitationService.sendInvitation({
                'uuid': $cookies.skynetuuid,
                'token': $cookies.skynettoken
            }, $scope.recipientEmail);

            invitationPromise.then(function (invitation) {
                $scope.recipientEmail = '';


            }, function (result) {
                /*
                 *TODO - Display an error notification to the user
                 */
            });
        };

    });