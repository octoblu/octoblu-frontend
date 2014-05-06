'use strict';

angular.module('octobluApp')
    .controller('adminController', function($rootScope, $scope, $cookies, $state, ownerService, userService, GroupService ) {

    })
    .controller('adminGroupDetailController', function($rootScope, $scope, $cookies) {

    })
    .controller('invitationController', function($rootscope, $cookies, $scope, InvitationService ) {
        //Send the invitation
        $scope.recipientEmail = '';

        $scope.send = function( ){

            var invitationPromise = InvitationService.sendInvitation({
                'uuid' : $cookies.skynetuuid,
                'token' : $cookies.skynettoken
            }, $scope.recipientEmail );

            invitationPromise.then(function(invitation){

            }, function(result){

            });

        };

    });