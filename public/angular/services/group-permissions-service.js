angular.module('octobluApp')
  .service('GroupPermissionsService', function (GroupService, PermissionsService, $q, $rootScope) {
    'use strict';
    var self = this;
    self.add = function(name) {
      return PermissionsService.add(name).then(function(resourcePermission) {
        return self.createSourceAndTargetGroups(resourcePermission);
      });
    };

    self.all = function() {
      return PermissionsService.allGroupPermissions();
    };

    self.delete = function(uuid) {
      return PermissionsService.delete(uuid);
    }

    self.createSourceAndTargetGroups = function(resourcePermission){
      var uuid = resourcePermission.resource.uuid;
      return $q.all([
        GroupService.addGroup(uuid + '_sources'),
        GroupService.addGroup(uuid + '_targets')
        ]).
        then(function(groups){
          var sourceGroup = groups[0];
          var targetGroup = groups[1];
          resourcePermission.source = sourceGroup.resource;
          resourcePermission.target = targetGroup.resource;

          return PermissionsService.update({
            resourcePermission : resourcePermission,
            sourceGroup : sourceGroup ,
            targetGroup: targetGroup
          });
        });
    };
    return self;
  });
