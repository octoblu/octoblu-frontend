'use strict';

var mongoose = require('mongoose');
var ResourceMixin = require('./mixins/resource');
var _ = require('lodash');
var ResourcePermission = mongoose.model('ResourcePermission');
var uuid = require('node-uuid');


var GroupSchema = new mongoose.Schema({
    uuid: {type: String, required: true, index: true, default: uuid.v1},
    name: String,
    resource: ResourceMixin,
    type: {
        type: String,
        default: 'default',
        enum: ['default', 'operators', 'permissions'],
        required: true
    },
    members: {type: [ResourceMixin], default: []}
});
GroupSchema.statics.updateProperties = ['name', 'members'];

GroupSchema.statics.permissionsSuffix = {
    sources: '_sources',
    targets: '_targets'
};

//enforcing resource-related stuff (wip)

function enforceDefaults(doc){
    doc.resource = doc.resource || {};
    doc.resource.uuid = doc.uuid;
    doc.resource.type = 'group';
    //Apparently, mongoose doesn't do doc validation on arrays of schemas.
    doc.members = doc.members || [];

    //If someone was lazy and put a whole object in, just pull the resource out.
    _.each(doc.members, function(member){
        if(member && member.resource){
            member = member.resource;
        }
    });
}

//going into the database
GroupSchema.pre('validate', function (next) {
    enforceDefaults(this);
    next();
});
//
////coming out of the database
GroupSchema.post('init', function(doc){
    enforceDefaults(doc);
});

/**
 *
 * @param groupUUID
 * @param ownerUUID
 */
GroupSchema.statics.findResourcePermission = function (groupUUID, ownerUUID) {
    var Group = this, group, sourcePermissionsGroup, targetPermissionsGroup;

    return Group.findOne({
        uuid: groupUUID,
        'resource.owner': ownerUUID
    }).exec().then(function (dbGroup) {
        if (!dbGroup) {
            throw {
                'error': 'Group not found!'
            };
        }
        group = dbGroup;
        return Group.find({
            type: 'permissions',
            'resource.owner': ownerUUID,
            'resource.parent': groupUUID
        }).exec();

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
                'grantedBy': ownerUUID,
                'source': sourcePermissionsGroup.resource.uuid,
                'target': targetPermissionsGroup.resource.uuid
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

GroupSchema.index({owner: 1, name: 1}, {unique: true});

module.exports = GroupSchema;
