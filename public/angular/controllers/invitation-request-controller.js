angular.module('octobluApp')
.controller('InvitationRequestController', function ($scope, $state, InvitationService) {

  $scope.invitationRequest = {};

  $scope.send = function(){
    InvitationService.requestInvite($scope.invitationRequest).then(function(result){
      $state.go('invitation.sent');
    }, function(errorMsg){
      console.error('Error sending invite', errorMsg);
    });
  };
});

