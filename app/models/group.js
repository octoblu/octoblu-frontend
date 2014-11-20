'use strict';
var octobluDB = require('../lib/database');
var _         = require('lodash');
var when      = require('when');
var uuid      = require('node-uuid');

function GroupModel() {
  var collection = octobluDB.getCollection('group');

  var methods = {
    updateProperties : ['name', 'members'],

    permissionsSuffix : {
      sources: '_sources',
      targets: '_targets'
    },

    findResourcePermission : function (groupUUID, ownerUUID) {
      var Group = this, group, sourcePermissionsGroup, targetPermissionsGroup;

      return Group.findOne({
        uuid: groupUUID,
        'resource.owner.uuid': ownerUUID
      }).then(function (dbGroup) {
        if (!dbGroup) {
          throw {
            'error': 'Group not found!'
          };
        }
        group = dbGroup;
        return Group.find({
          type: 'permissions',
          'resource.owner.uuid': ownerUUID,
          'resource.parent.uuid': groupUUID
        });

      }).then(function (permissionsGroups) {
        if (!permissionsGroups) {
          throw {
            error: 'Permission groups not found'
          };

        } else {
          sourcePermissionsGroup = _.findWhere(permissionsGroups, {
            name: group.uuid + Group.permissionsSuffix.sources
          });

          targetPermissionsGroup = _.findWhere(permissionsGroups, {
            name: group.uuid + Group.permissionsSuffix.targets
          });

          return ResourcePermission.findOne({
            'resource.owner.uuid': ownerUUID,
            'source.uuid': sourcePermissionsGroup.resource.uuid,
            'target.uuid': targetPermissionsGroup.resource.uuid
          });
        }
      }).then(function (resourcePermission) {
        if (!resourcePermission) {
          throw {
            error: 'Resource permission not found'
          };

        } else {
          resourcePermission.source = sourcePermissionsGroup;
          resourcePermission.target = targetPermissionsGroup;
        }
        return resourcePermission;
      });
    },

    findGroupsContainingResource : function (options) {
      var self = this;
      var resourceUUID = options.resourceUUID,
      groupResourceQuery = resourceUUID  instanceof Array ? {$in: resourceUUID} : resourceUUID;

      return self.find({
        'members.uuid': groupResourceQuery
      });
    }
  }

  return _.extend({}, collection, methods);
}

module.exports = new GroupModel();
