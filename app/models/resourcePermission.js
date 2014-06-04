'use strict';

var mongoose = require('mongoose'),
    Resource = require('./mixins/resource');
// define the schema for our user model


var ResourcePermissionSchema = new mongoose.Schema({
    //Yep, a resource permission is also a resource. Just makes queries easier.
    //Plus, we might want to have crud permissions on these eventually. Who knows?
    resource: Resource.Resource,
    grantedBy: Resource.ResourceId,
    source: Resource.ResourceId,
    target: Resource.ResourceId,
    permission: {type: Object, required: true, default: {
        configure: false,
        discover: true,
        message_send: false,
        message_receive: false
    } }
});

function enforceDefaults(doc){
    doc.resource = doc.resource || {};
    doc.resource.type = 'permission';
}

//going into the database
ResourcePermissionSchema.pre('validate', function (next) {
    enforceDefaults(this);
    next();
});
//
////coming out of the database
ResourcePermissionSchema.post('init', function(doc){
    enforceDefaults(doc);
});

module.exports = ResourcePermissionSchema;

