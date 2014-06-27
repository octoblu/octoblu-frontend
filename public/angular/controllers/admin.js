'use strict';

angular.module('octobluApp')
    .controller('adminController', function (allGroupResourcePermissions, $log, $scope, $modal, currentUser, allDevices, operatorsGroup, GroupService, PermissionsService, InvitationService) {
        $scope.user = currentUser;
        $scope.allDevices = allDevices;
        $scope.allGroupResourcePermissions = allGroupResourcePermissions;
        $scope.ownedDevices = allDevices;
        $scope.operatorsGroup = operatorsGroup;
        $scope.allResources = _.union(operatorsGroup.members,
            _.pluck(allDevices, 'resource'));

        $scope.addResourcePermission = function () {
            if ($scope.resourcePermissionName) {
                var resourcePermission, sourceGroup;
                PermissionsService.add({ name: $scope.resourcePermissionName })
                    .then(function (newResourcePermission) {
                        resourcePermission = newResourcePermission;
                        $scope.allGroupResourcePermissions.push(resourcePermission);
                        return resourcePermission;
                    })
                    .then(function (resourcePermission) {
                        return GroupService.addGroup(resourcePermission.resource.uuid + '_sources');
                    })
                    .then(function (srcGroup) {
                        sourceGroup = srcGroup;
                        resourcePermission.source = sourceGroup.resource;
                        return GroupService.addGroup(resourcePermission.resource.uuid + '_targets');
                    })
                    .then(function (targetGroup) {
                        resourcePermission.target = targetGroup.resource;
                        return PermissionsService.update(
                            { resourcePermission: resourcePermission,
                                targetGroup: targetGroup,
                                sourceGroup: sourceGroup });
                    })
                    .then(function (updatedResourcePermission) {
                        angular.copy(updatedResourcePermission, resourcePermission);
                    });
            }
        };

        $scope.deleteResourcePermission = function (resourcePermission) {
            $scope.confirmModal($modal, $scope, $log,
                'Confirm Delete Group', 'Are you sure you want to delete ' + resourcePermission.name + ' group?',
                function () {
                    PermissionsService.delete(resourcePermission.resource.uuid)
                        .then(function () {
                            var index = $scope.allGroupResourcePermissions.indexOf(resourcePermission);
                            $scope.allGroupResourcePermissions.splice(index, 1);
                            $state.go('.all');
                        });
                });
        };

        $scope.getDeviceImageUrl = function (device) {
            if (device && device.type === 'gateway') {
                return '/assets/images/network_hub.png';
            }
            return '/assets/images/robot8.png';
        };

        //Send the invitation
        $scope.recipientEmail = '';

        $scope.send = function () {

            var invitationPromise = InvitationService.sendInvitation({
                'uuid': currentUser.skynetuuid,
                'token': currentUser.skynettoken
            }, $scope.recipientEmail);

            invitationPromise.then(function (invitation) {
                $scope.recipientEmail = '';


            }, function (result) {
                /*
                 *TODO - Display an error notification to the user
                 */
            });
        };

    })
    .controller('adminGroupDetailController', function ($scope, PermissionsService, GroupService, resourcePermission, sourcePermissionsGroup, targetPermissionsGroup) {
        $scope.resourcePermission = resourcePermission;
        $scope.sourcePermissionsGroup = sourcePermissionsGroup;
        $scope.targetPermissionsGroup = targetPermissionsGroup;

        $scope.removeResourceFromGroup = function (group, resource) {
            group.members = _.filter(group.members, function (member) {
                return member.uuid !== resource.uuid;
            });
        };

        $scope.addResourceToGroup = function (group, resource) {
            var resourcePermission = _.findWhere(group.members, {uuid: resource.uuid});

            if (!resourcePermission) {
                group.members.push(resource);
            }
        };

        $scope.save = function () {
            updateResourceTotals();
            PermissionsService.update(
                { resourcePermission: $scope.resourcePermission,
                    targetGroup: $scope.targetPermissionsGroup,
                    sourceGroup: $scope.sourcePermissionsGroup }
            ).then(function (whitelists) {
                    console.log('whitelists');
                    console.log(whitelists)
                }, function (error) {
                    console.log('error saving resource permission');
                    console.log(error);
                });
        };

        function updateResourceTotals() {
            var resource = $scope.resourcePermission.resource;
            resource.properties = resource.properties || {};
            resource.properties.resourceCounts = {};
            var resourceCounts = resource.properties.resourceCounts;

            _.chain($scope.sourcePermissionsGroup.members)
                .union($scope.targetPermissionsGroup.members)
                .uniq(function (resource) {
                    return resource.uuid;
                })
                .groupBy('type')
                .pairs()
                .each(function (pair) {
                    var type = pair[0], count = pair[1].length;
                    resourceCounts[type] = count;
                });
        }
    });