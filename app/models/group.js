'use strict';

var mongoose = require('mongoose');
var Resource = require('./mixins/resource');
var _ = require('lodash');
var ResourcePermission = mongoose.model('ResourcePermission');
var uuid = require('node-uuid');
var Q = require('Q');


var GroupSchema = new mongoose.Schema({
    uuid: {type: String, required: true, index: true, default: uuid.v1},
    name: {type: String, index: true},
    type: {
        type: String,
        default: 'default',
        enum: ['default', 'operators'],
        required: true
    },
    members: {type: [Resource.ResourceId], default: [], index: true}
});
GroupSchema.statics.updateProperties = ['name', 'members'];

GroupSchema.statics.permissionsSuffix = {
    sources: '_sources',
    targets: '_targets'
};

Resource.makeResourceModel({schema: GroupSchema, type: 'group', uuidProperty: 'uuid'});

GroupSchema.methods.saveWithPromise = function(){
    var defer = Q.defer();
    this.save(function(error, group){
        if(error) {
            return defer.reject(error);
        }
        defer.resolve(group);
    });
    return defer.promise;
};

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

GroupSchema.statics.findGroupsContainingResource = function (options) {
    var resourceUUID = options.resourceUUID,
        Group = mongoose.model('Group'),
        groupResourceQuery = resourceUUID  instanceof Array ? {$in: resourceUUID} : resourceUUID;

    return Group.find({
        'members.uuid': groupResourceQuery
    }).exec();
};

GroupSchema.pre('validate', function (next) {
    this.members = _.map(this.members, function (member) {
        // make sure we store the display properties on non-resource objects.
        if (!(member.properties)) {
            member.properties = Resource.generateProperties(member);
        }
        return member;
    });

    next();
});

//GroupSchema.post('init', function (doc) {
//    doc.members = _.map(doc.members, function (member) {
//        if (!(member.properties)) {
//            member.properties = Resource.generateProperties(member);
//        }
//        return member;
//    });
//});

GroupSchema.index({'resource.owner.uuid': 1, name: 1}, {unique: true});

module.exports = GroupSchema;
