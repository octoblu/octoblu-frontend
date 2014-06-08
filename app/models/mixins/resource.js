'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    uuid = require('node-uuid');

var ResourceType = {
    type: String,
    enum: ['user', 'device', 'group', 'permission', 'resource-permission'],
    index: true
};

//These will mainly be used as "pointers", because we need more than the uuid to identify a resource.
var ResourceId = {
    uuid: {type: String, index: true },
    type: ResourceType
};

//A resource is just a resource ID with extra properties & some required fields.
//This so we can put one into a slot for a resourceId, and Mongoose will cast it for us.
var Resource =
    _.extend({
        owner: ResourceId,
        parent: ResourceId,
        properties: mongoose.Schema.Types.Mixed
    }, _.cloneDeep(ResourceId));

//Extra constraints for resources
Resource.uuid.required = true;
Resource.uuid.default = uuid.v1;
Resource.uuid.unique = true;
Resource.type.required = true;

function enforceDefaults(doc, uuidProperty, type) {
    //convention to sync ids to resources.
    if (uuidProperty && doc.get(uuidProperty)) {
        doc.resource.uuid = doc.get(uuidProperty);
    }
    if (type) {
        doc.resource.type = type;
    }
}

function makeResourceObject( options ){

    var type = options.type, model = options.model, uuidProperty = options.uuidProperty;
    var resource = _.cloneDeep(model);
    if(options.includeProperties){
       resource =  _.pick(_.cloneDeep(model), options.includeProperties);
    }
    return  {
        uuid : model[uuidProperty],
        type : type || 'device' ,
        owner : {
            uuid :  model.owner,
            type : options.ownerType
        },
        resource : resource
    };
}

function makeResourceModel(options) {
    var schema = options.schema,
        type = options.type,
        uuidProperty = options.uuidProperty;

    schema.add({resource: Resource});

    if (type || uuidProperty) {
        //going into the database
        schema.pre('validate', function (next) {
            enforceDefaults(this, uuidProperty, type);
            next();
        });

        //coming out of the database
        schema.post('init', function (doc) {
            enforceDefaults(doc, uuidProperty, type);
        });
    }
    schema.virtual('resourceId').get(function () {
        return {
            uuid: this.resource.uuid,
            type: this.resource.type
        };
    });

    schema.virtual('resource.owner.resourceId').get(function () {
        return {
            uuid: this.resource.owner.uuid,
            type: this.resource.owner.type
        };
    });

    schema.virtual('resource.parent.resourceId').get(function () {
        return {
            uuid: this.resource.parent.uuid,
            type: this.resource.parent.type
        };
    });
}


module.exports = {
    Resource: Resource,
    ResourceType: ResourceType,
    ResourceId: ResourceId,
    makeResourceModel: makeResourceModel,
    makeResourceObject : makeResourceObject
};
