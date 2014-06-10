'use strict';

var mongoose = require('mongoose'),
    Resource = require('./mixins/resource'),
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
ResourcePermissionSchema.statics.compilePermissions = function(resourceUUID){
    var Group = mongoose.model('group');
    return Group.find({
        members : {
            $elemMatch : {
                'resource.uuid' : resourceUUID
            }
        }
    }).exec();
};

module.exports = ResourcePermissionSchema;

