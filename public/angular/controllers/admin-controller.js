angular.module('octobluApp')
  .controller('AdminController', function ($window,  $scope, InvitationService, GroupPermissionsService, allDevices, operatorsGroup) {
    var self = this;

    $scope.ownedDevices = allDevices;
    $scope.operatorsGroup = operatorsGroup;

    this.refreshGroups = function () {
      GroupPermissionsService.all().then(function (groupPermissions) {
        console.log(groupPermissions);
        $scope.groups = groupPermissions;
      });
    };

    this.refreshGroups();

    $scope.addGroup = function (name) {
      GroupPermissionsService.add({name: name}).then(function (groupPermission) {
        console.log('added', name, groupPermission);
        self.refreshGroups();
      });
    };

    $scope.deleteGroup = function (groupUUID) {
      if ($window.confirm('Are you sure you want to delete this group?')) {
        GroupPermissionsService.delete(groupUUID).then(function () {
          self.refreshGroups();
        });
      }
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
