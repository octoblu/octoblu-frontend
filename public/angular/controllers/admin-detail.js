'use strict';

angular.module('octobluApp')
  .controller('adminGroupDetailController', function ($scope, operatorsGroup, allDevices, PermissionsService, GroupService, resourcePermission, sourcePermissionsGroup, targetPermissionsGroup) {
    $scope.resourcePermission = resourcePermission;
    $scope.sourcePermissionsGroup = sourcePermissionsGroup;
    $scope.targetPermissionsGroup = targetPermissionsGroup;

    $scope.allResources = _.union(operatorsGroup.members, allDevices);

    $scope.getDisplayName = function (resource) {
      if (resource.properties) {
        resource = resource.properties;
      }
      return resource.name || resource.displayName || resource.email || resource.type || 'unknown';
    };

    $scope.removeResourceFromGroup = function (group, resource) {
      group.members = _.filter(group.members, function (member) {
        return member.uuid !== resource.uuid;
      });
    };

    $scope.addResourceToGroup = function (group, resource) {
      if (!_.findWhere(group.members, {uuid: resource.uuid})) {
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
