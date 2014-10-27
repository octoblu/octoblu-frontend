'use strict';

angular.module('octobluApp')
    .controller('adminController', function (allGroupResourcePermissions,  $scope, $modal, $state, allDevices, operatorsGroup, GroupService, PermissionsService, InvitationService) {
        $scope.allDevices = allDevices;
        $scope.allGroupResourcePermissions = allGroupResourcePermissions;
        $scope.ownedDevices = allDevices;
        $scope.operatorsGroup = operatorsGroup;
        $scope.allResources = _.union(operatorsGroup.members, allDevices);

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
            InvitationService.sendInvitation($scope.recipientEmail)
                .then(function (invitation) {
                    $scope.recipientEmail = '';
                });
        };
    });
