'use strict';

var mongoose = require('mongoose'),
    Resource = require('./mixins/resource'),
    _ = require('lodash'),
    Q = require('q'),
    uuid = require('node-uuid'),
    rest = require('rest'),
    mime = require('rest/interceptor/mime'),
    errorCode = require('rest/interceptor/errorCode'),
    client = rest.wrap(mime).wrap(errorCode);

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

ResourcePermissionSchema.statics.findPermissionsOnResource = function (options) {
    var Group = mongoose.model('Group'),
        ResourcePermission = mongoose.model('ResourcePermission');

    return Group.findGroupsContainingResource(options)
        .then(function (groups) {
            var resourceUUIDs = _.pluck(_.pluck(groups, 'resource'), 'uuid');
            resourceUUIDs.push(options.resourceUUID);

            return ResourcePermission.findByResource({
                ownerUUID: options.ownerUUID,
                resourceUUID: resourceUUIDs,
                permissionDirection: options.permissionDirection
            });
        });
};

ResourcePermissionSchema.statics.findFlattenedPermissionsOnResource = function (options) {
    var Group = mongoose.model('Group'),
        ResourcePermission = mongoose.model('ResourcePermission'),
        groups,
        otherDirection = options.permissionDirection === 'source' ? 'target' : 'source',
        resourceUUIDs = options.resourceUUID instanceof Array ?
            options.resourceUUID : [options.resourceUUID],

        flatPermissions;

    return Group.findGroupsContainingResource({ownerUUID: options.ownerUUID, resourceUUID: resourceUUIDs})
        .then(function (dbGroups) {
            groups = dbGroups;
            var groupUUIDs = _.pluck(_.pluck(groups, 'resource'), 'uuid');
            resourceUUIDs = resourceUUIDs.concat(groupUUIDs);
            return ResourcePermission.findByResource({
                ownerUUID: options.ownerUUID,
                resourceUUID: resourceUUIDs,
                permissionDirection: options.permissionDirection
            });
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

ResourcePermissionSchema.statics.findCompiledPermissionsOnResource = function (options) {
    var ResourcePermission = mongoose.model('ResourcePermission'),
        otherDirection = (options.permissionDirection === 'source' ? 'target' : 'source');

    return ResourcePermission.findFlattenedPermissionsOnResource(options)
        .then(function (flatPermissions) {
            flatPermissions = _.chain(flatPermissions);

            return flatPermissions
                .groupBy(function (permission) {
                    return permission[otherDirection].uuid;
                })
                .pairs()
                .map(function (pair) {
                    var permissions = pair[1];
                    var compiled = _.reduce(permissions, function (compiledPermission, permission) {
                        if (!compiledPermission) {
                            return permission;
                        }

                        if (!(compiledPermission.name instanceof Array)) {
                            compiledPermission.name = [compiledPermission.name];
                        }

                        if (permission.name)
                            compiledPermission.name.push(permission.name);
                        _.each(_.keys(permission.permissions), function (permissionName) {
                            compiledPermission.permissions[permissionName] =
                                compiledPermission.permissions[permissionName] || permission.permissions[permissionName];
                        });

                        return compiledPermission;
                    }, _.cloneDeep(permissions.pop()));
                    return compiled;
                }).value();
        });
};

ResourcePermissionSchema.statics.findByResource = function (options) {
    var ResourcePermission = mongoose.model('ResourcePermission'),
        query = {},
        resourceQuery = options.resourceUUID;
    if (options.resourceUUID instanceof Array) {
        resourceQuery = {$in: options.resourceUUID};
    }

    query[options.permissionDirection + '.uuid'] = resourceQuery;

    if (options.ownerUUID) {
        query['resource.owner.uuid'] = options.ownerUUID;
    }

    return ResourcePermission.find(query).exec();
};

ResourcePermissionSchema.statics.updateSkynetPermissions = function (options) {
    var ownerResource = options.ownerResource,
        resources = options.resources,
        skynetUrl = options.skynetUrl,
        ResourcePermission = mongoose.model('ResourcePermission'), deviceProperties;

    return Q.all(
        _.compact(_.map(resources, function (resource) {
            if (resource.type !== 'user') {
                return ResourcePermission.findCompiledPermissionsOnResource({
                    ownerUUID: ownerResource.uuid,
                    resourceUUID: resource.uuid,
                    permissionDirection: 'target'
                })
                    .then(function (permissions) {
                        return ResourcePermission.formatSkynetPermissions(permissions);
                    })
                    .then(function (permissions) {
                        deviceProperties = {
                            viewWhitelist: permissions.viewWhitelist,
                            updateWhitelist: permissions.updateWhitelist,
                            sendWhitelist: permissions.sendWhitelist,
                            receiveWhitelist: permissions.receiveWhitelist
                        };

                        return client({
                            method: 'PUT',
                            path: skynetUrl + '/devices/' + resource.uuid,
                            entity: deviceProperties,
                            headers: {
                                skynet_auth_uuid: ownerResource.uuid,
                                skynet_auth_token: ownerResource.properties.skynettoken,
                                'Content-Type': 'application/json'
                            }
                        });
                    });
            }
        })))
        .then(function () {
            return deviceProperties;
        });
};

ResourcePermissionSchema.statics.formatSkynetPermissions = function (permissions) {

    var viewWhitelist = _.filter(permissions, function (permission) {
        return permission.permissions.discover;
    });
    var updateWhitelist = _.filter(permissions, function (permission) {
        return permission.permissions.configure;
    });
    var sendWhitelist = _.filter(permissions, function (permission) {
        return permission.permissions.message_send;
    });
    var receiveWhitelist = _.filter(permissions, function (permission) {
        return permission.permissions.message_receive;
    });

    return {
        viewWhitelist: _.pluck(_.pluck(viewWhitelist, 'source'), 'uuid'),
        updateWhitelist: _.pluck(_.pluck(updateWhitelist, 'source'), 'uuid'),
        sendWhitelist: _.pluck(_.pluck(sendWhitelist, 'source'), 'uuid'),
        receiveWhitelist: _.pluck(_.pluck(receiveWhitelist, 'source'), 'uuid')
    };
};
module.exports = ResourcePermissionSchema;

