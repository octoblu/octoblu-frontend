angular.module('octobluApp')
    .controller('AdminController', function ($scope, PermissionsService ) {
    var self = this;

    this.refreshGroups = function() {
      PermissionsService.allGroupPermissions().then(function (groupPermissions) {
        $scope.groups = groupPermissions;
      });
    };

    this.refreshGroups();

      $scope.addGroup = function(name) {
        PermissionsService.add({name: name}).then(function(groupPermission){
          self.refreshGroups();
        });
      };

      $scope.deleteGroup = function(groupUUID){
        PermissionsService.delete(groupUUID).then(function(){
          self.refreshGroups();
        });
      };
    }); 
