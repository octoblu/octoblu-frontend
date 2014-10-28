angular.module('octobluApp')
    .controller('AdminController', function ($window, $scope, GroupPermissionsService ) {
    var self = this;

    this.refreshGroups = function() {
      GroupPermissionsService.all().then(function (groupPermissions) {
        console.log(groupPermissions);
        $scope.groups = groupPermissions;
      });
    };

    this.refreshGroups();

      $scope.addGroup = function(name) {
        GroupPermissionsService.add({name: name}).then(function(groupPermission){
          console.log('added', name, groupPermission);
          self.refreshGroups();
        });
      };

      $scope.deleteGroup = function(groupUUID){
        if ($window.confirm('Are you sure you want to delete this group?')){
          GroupPermissionsService.delete(groupUUID).then(function(){
            self.refreshGroups();
          });
        }
      };
    }); 
