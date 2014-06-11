'use strict';

var mongoose = require('mongoose'),
    Resource = require('./mixins/resource'),
    _ = require('lodash'),
    Q = require('q'),
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

ResourcePermissionSchema.statics.findPermissionsOnResource = function (ownerUUID, resourceUUID, permissionDirection) {
    var resourceUUIDs = [resourceUUID];
    var Group = mongoose.model('Group'),
        ResourcePermission = mongoose.model('ResourcePermission');

    return Group.findGroupsContainingResource(ownerUUID, resourceUUID)
        .then(function (groups) {
            var groupUUIDs = _.pluck(_.pluck(groups, 'resource'), 'uuid');
            resourceUUIDs = resourceUUIDs.concat(groupUUIDs);
            return ResourcePermission.findByResource(ownerUUID, resourceUUIDs, permissionDirection);
        });
};

ResourcePermissionSchema.statics.findFlattenedPermissionsOnResource = function (ownerUUID, resourceUUIDs, permissionDirection) {
    var Group = mongoose.model('Group'),
        ResourcePermission = mongoose.model('ResourcePermission'),
        groups,
        otherDirection = permissionDirection === 'source' ? 'target' : 'source',
        flatPermissions;

    return Group.findGroupsContainingResource(ownerUUID, resourceUUIDs)
        .then(function (dbGroups) {
            groups = dbGroups;
            var groupUUIDs = _.pluck(_.pluck(groups, 'resource'), 'uuid');
            resourceUUIDs = resourceUUIDs.concat(groupUUIDs);
            return ResourcePermission.findByResource(ownerUUID, resourceUUIDs, permissionDirection);
        })
        .then(function (permissions) {
            var groupPermissions = _.filter(permissions, function (permission) {
                return permission[otherDirection].type === 'group';
            });
            flatPermissions = _.xor(permissions, groupPermissions);

            return Q.all(_.map(groupPermissions, function (permission) {
                return Group.findOne({'resource.uuid': permission[otherDirection].uuid}).exec()
                    .then(function (group) {
                        if (group) {
                            return {
                                permission: permission.toObject(),
                                group: group.toObject()
                            };
                        }
                    });
            }));
        })
        .then(function (groupPermissionArray) {
            return _.chain(groupPermissionArray)
                .map(function (groupPermission) {
                    return _.map(groupPermission.group.members, function (member) {
                        var flatPermission = _.clone(groupPermission.permission);
                        flatPermission[otherDirection] = member;
                        return flatPermission;
                    })
                })
                .flatten()
                .union(flatPermissions)
                .value();
        });
};

ResourcePermissionSchema.statics.findCompiledPermissionsOnResource = function (ownerUUID, resourceUUID, permissionDirection) {
    var ResourcePermission = mongoose.model('ResourcePermission'),
        otherDirection = permissionDirection === 'source' ? 'target' : 'source';

    return ResourcePermission.findFlattenedPermissionsOnResource(ownerUUID, resourceUUID, permissionDirection)
        .then(function (flatPermissions) {
            flatPermissions = _.chain(flatPermissions);

            return flatPermissions
                .groupBy(function (permission) {
                    return permission[otherDirection].uuid;
                })
                .pairs()
                .map(function (pair) {
                    var permissions = pair[1];
                    var compiled =  _.reduce(permissions, function (compiledPermission, permission) {
                        if (!compiledPermission) {
                            return permission;
                        }

                        if(!(compiledPermission.name instanceof Array)){
                            compiledPermission.name = [compiledPermission.name];
                        }

                        if (permission.name)
                            compiledPermission.name.push(permission.name);
                        _.each( _.keys(permission.permissions), function (permissionName) {
                            compiledPermission.permissions[permissionName] =
                                compiledPermission.permissions[permissionName] || permission.permissions[permissionName];
                        });

                        return compiledPermission;
                    }, _.cloneDeep(permissions.pop()));
                    return compiled;
                }).value();
        });
};

ResourcePermissionSchema.statics.findByResource = function (ownerUUID, resourceUUIDs, permissionDirection) {
    var ResourcePermission = mongoose.model('ResourcePermission'),
        query = {},
        resourceQuery = resourceUUIDs;
    if (resourceUUIDs instanceof Array) {
        resourceQuery = {$in: resourceUUIDs};
    }

    query[permissionDirection + '.uuid'] = resourceQuery;
    query['resource.owner.uuid'] = ownerUUID;

    return ResourcePermission.find(query).exec();
};
module.exports = ResourcePermissionSchema;

