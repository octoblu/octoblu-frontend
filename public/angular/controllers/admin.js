'use strict';

angular.module('e2eApp')
    .controller('adminController', function($rootScope, $scope, $cookies, $state, $modal  ) {

        $scope.sendInvitation = function(){
            var invitationModal = $modal.open({
                templateUrl : 'pages/admin/groups/invitation.html',
                controller : 'invitationController',
                backdrop : true
            });

        }

    })
    .controller('adminGroupDetailController', function($rootScope, $scope, $cookies ) {

    })
    .controller('invitationController', function($rootScope, $scope, $cookies, $modalInstance ) {

        $scope.send = function(){

        };

        $scope.close = function(){
            $modalInstance.dismiss('cancel');

        };

    });