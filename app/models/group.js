'use strict';

var mongoose = require('mongoose');
var ResourceSchema = require('./resource');
var _ = require('lodash');
var ResourcePermission = require('./resourcePermission');
var uuid = require('node-uuid');
// define the schema for our user model
var GroupSchema = mongoose.Schema({
    uuid: {type: String, required: true, index: true, default: uuid.v1()},
    name: String,
    owner: {type: String, required: true, index: true },
    resource: ResourceSchema,
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
            //Create the source and target permissions groups that will
            //hold all the sources and targets.
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
            //Create the ResourcePermission and add the references to the source and target Groups
        } else {
            resourcePermission.source = sourcePermissionGroup;
            resourcePermission.target = targetPermissionGroup;
        }
        return resourcePermission;
    });
};


GroupSchema.index({owner: 1, name: 1}, {unique: true});
mongoose.model('Group', GroupSchema);
mongoose.exports = GroupSchema;
