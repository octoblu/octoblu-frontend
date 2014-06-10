'use strict';

var mongoose = require('mongoose'),
    Resource = require('./mixins/resource'),
    _ = require('lodash'),
    uuid = require('node-uuid');

var ResourcePermissionSchema = new mongoose.Schema({
    //Yep, a resource permission is also a resource. Just makes queries easier.
    //Plus, we might want to have crud permissions on these eventually. Who knows?
    uuid: {type: String, required: true, index: true, default: uuid.v1},
    name: String,
    grantedBy: Resource.ResourceId,
    source: Resource.ResourceId,
    target: Resource.ResourceId,
    permissions: {type: Object, required: true, default: {
        configure: false,
        discover: true,
        message_send: false,
        message_receive: false
    } }
});

Resource.makeResourceModel({schema: ResourcePermissionSchema, type: 'resource-permission', uuidProperty: 'uuid'});

//Create a list of permission/resource pairs that show exactly which resource can affect me.
ResourcePermissionSchema.statics.compilePermissions = function (ownerUUID, resourceUUID) {

};

ResourcePermissionSchema.statics.findPermissionsOnTarget = function (ownerUUID, targetUUID) {
    var targetUUIDs = [targetUUID];
    var Group = mongoose.model('Group'),
        ResourcePermission = mongoose.model('ResourcePermission');

    return Group.findGroupsContainingResource(ownerUUID, targetUUID)
        .then(function (groups) {
            var groupUUIDs = _.pluck(_.pluck(groups, 'resource'), 'uuid');
            targetUUIDs = targetUUIDs.concat(groupUUIDs);
            return ResourcePermission.findByTarget(ownerUUID, targetUUIDs);
        });
};

ResourcePermissionSchema.statics.getFlattenedPermissionsByTarget = function (ownerUUID, targetUUID) {
    var targetUUIDs = [targetUUID];
    var Group = mongoose.model('Group'),
        ResourcePermission = mongoose.model('ResourcePermission'),
        groups;

    return Group.findGroupsContainingResource(ownerUUID, targetUUID)
        .then(function (dbGroups) {
            groups = _.indexBy(dbGroups, 'uuid');
            var groupUUIDs = _.keys(groups);
            targetUUIDs = targetUUIDs.concat(groupUUIDs);
            return ResourcePermission.findByTarget(ownerUUID, targetUUIDs);
        })
        .then(function (permissions) {
            var groupPermissions = _.chain(_.filter(permissions, function (permission) {
                return permission.source.type === 'group';
            }));
            return groupPermissions
                .map(function (groupPermission) {
                    return _.map(
                        groups[groupPermission.source.uuid].members, function (member) {
                            var materializedPermission = _.clone(groupPermission);
                            materializedPermission.source = member;
                            return materializedPermission;
                        });
                }).flatten()
                .union(permissions)
                .without(groupPermissions)
                .value();
        });
};

ResourcePermissionSchema.statics.findByTarget = function (ownerUUID, targetUUIDs) {
    var ResourcePermission = mongoose.model('ResourcePermission'),
        targetQuery = targetUUIDs;
    if (targetUUIDs instanceof Array) {
        targetQuery = {$in: targetUUIDs};
    }
    return ResourcePermission.find({
        'resource.owner.uuid': ownerUUID,
        'target.uuid': targetQuery
    }).exec();
};
ResourcePermissionSchema.statics.findPermissionsOnSource = function (ownerUUID, sourceUUID) {
    var sourceUUIDs = [sourceUUID];
    var Group = mongoose.model('Group'),
        ResourcePermission = mongoose.model('ResourcePermission');

    return Group.findGroupsContainingResource(ownerUUID, sourceUUID)
        .then(function (groups) {
            var groupUUIDs = _.pluck(_.pluck(groups, 'resource'), 'uuid');
            sourceUUIDs = sourceUUIDs.concat(groupUUIDs);
            return ResourcePermission.findBySource(ownerUUID, sourceUUIDs);
        });
};

ResourcePermissionSchema.statics.findBySource = function (ownerUUID, sourceUUIDs) {
    var ResourcePermission = mongoose.model('ResourcePermission'),
        sourceQuery = sourceUUIDs;
    if (sourceUUIDs instanceof Array) {
        sourceQuery = {$in: sourceUUIDs};
    }
    return ResourcePermission.find({
        'resource.owner.uuid': ownerUUID,
        'source.uuid': sourceQuery
    }).exec();
};

module.exports = ResourcePermissionSchema;

