'use strict';

var mongoose = require('mongoose');
var ResourceMixin = require('./mixins/resource');
var _ = require('lodash');
var ResourcePermission = mongoose.model('ResourcePermission');
var uuid = require('node-uuid');

var GroupSchema = mongoose.Schema({
    uuid: {type: String, required: true, index: true, default: uuid.v1()},
    name: String,
    resource: ResourceMixin,
    type: {
        type: String,
        default: 'default',
        enum: ['default', 'operators', 'permissions'],
        required: true
    },
    members: {type: Array, default: []}
});
GroupSchema.statics.updateProperties = ['name', 'members'];
/**
 *
 * @param groupUUID
 * @param ownerUUID
 */
GroupSchema.statics.findResourcePermission = function (groupUUID, ownerUUID) {
    var Group = this, group, sourcePermissionGroup, targetPermissionGroup;

    return Group.findOne({
        uuid: groupUUID,
        owner: ownerUUID
    }).exec().then(function (dbGroup) {
        if (!dbGroup) {
            throw {
                'error': 'Group not found!'
            };
        }
        group = dbGroup;
        return Group.find({
            type: 'permissions',
            owner: ownerUUID,
            'resource.parent': groupUUID
        }).exec();

    }).then(function (permissionsGroups) {
        if (!permissionsGroups) {
            throw {
                error: 'Permission groups not found'
            };

        } else {
            sourcePermissionGroup = _.findWhere(permissionsGroups, {
                name: group.name + '.sources'
            });

            targetPermissionGroup = _.findWhere(permissionsGroups, {
                name: group.name + '.targets'
            });

            return ResourcePermission.findOne({
                'grantedBy': ownerUUID,
                'source': sourcePermissionGroup.uuid,
                'target': targetPermissionGroup.uuid
            }).exec().lean();
        }
    }).then(function (resourcePermission) {
        if (!resourcePermission) {
            throw {
                error: 'Resource permission not found'
            };

        } else {
            resourcePermission.source = sourcePermissionGroup;
            resourcePermission.target = targetPermissionGroup;
        }
        return resourcePermission;
    });
};

GroupSchema.post('init', function (doc) {
    doc.resource.uuid = doc.uuid;
    doc.resource.type = 'group';
});

GroupSchema.index({owner: 1, name: 1}, {unique: true});

module.exports = GroupSchema;
