'use strict';

var mongoose = require('mongoose');
var Resource = require('./mixins/resource');
var _ = require('lodash');
var ResourcePermission = mongoose.model('ResourcePermission');
var uuid = require('node-uuid');


var GroupSchema = new mongoose.Schema({
    uuid: {type: String, required: true, index: true, default: uuid.v1},
    name: String,
    type: {
        type: String,
        default: 'default',
        enum: ['default', 'operators', 'permissions'],
        required: true
    },
    members: {type: [Resource.ResourceId], default: []}
});
GroupSchema.statics.updateProperties = ['name', 'members'];

GroupSchema.statics.permissionsSuffix = {
    sources: '_sources',
    targets: '_targets'
};

Resource.makeResourceModel({schema: GroupSchema, type: 'group', uuidProperty: 'uuid'});

/**
 *
 * @param groupUUID
 * @param ownerUUID
 */
GroupSchema.statics.findResourcePermission = function (groupUUID, ownerUUID) {
    var Group = this, group, sourcePermissionsGroup, targetPermissionsGroup;

    return Group.findOne({
        uuid: groupUUID,
        'resource.owner.uuid': ownerUUID
    }).exec().then(function (dbGroup) {
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
        }).exec();

    }).then(function (permissionsGroups) {
        if (! permissionsGroups) {
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
                'resource.owner.uuid' : ownerUUID,
                'source.uuid': sourcePermissionsGroup.resource.uuid,
                'target.uuid': targetPermissionsGroup.resource.uuid
            }).lean().exec();
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
};

GroupSchema.index({'resource.owner.uuid': 1, name: 1}, {unique: true});

module.exports = GroupSchema;
