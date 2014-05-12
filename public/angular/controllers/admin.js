'use strict';

angular.module('octobluApp')
    .controller('adminController', function ($scope, $cookies, currentUser, GroupService) {
        $scope.groupName = undefined;
        $scope.errors = [];
        $scope.user = currentUser;

        $scope.addGroup = function () {

            if ($scope.groupName) {
                GroupService.addGroup($scope.groupName, $cookies.skynetuuid, $cookies.skynettoken)
                    .then(function (group) {
                        $scope.user.groups = $scope.user.groups || [];
                        $scope.user.groups.push(group);
                    },
                    function (errorResult) {
                        //TODO - Add notification errors to be displayed
                    });
            }
        };

        $scope.deleteGroup = function (group) {
            GroupService.del


        };

        $scope.getDeviceImageUrl = function (device) {
            if (device && device.type === 'gateway') {
                return '/assets/images/network_hub.png';
            }
            return '/assets/images/robot8.png';
        };

    })
    .controller('adminGroupDetailController', function (currentUser, $scope, $stateParams, $cookies, GroupService) {
        var currentGroup = _.findWhere(currentUser.groups, { uuid: $stateParams.uuid });
        if (currentGroup) {
            GroupService.getGroup(currentUser.skynetuuid, currentGroup.uuid).then(function(group){
                console.log(group);
            });
        }
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