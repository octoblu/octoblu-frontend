'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    crypto = require('crypto'),
    uuid = require('node-uuid');

var ResourceType = {
    type: String,
    enum: ['user', 'device', 'group', 'permission', 'resource-permission']
};

//These will mainly be used as "pointers", because we need more than the uuid to identify a resource.
var ResourceId = {
    uuid: {type: String, index: true },
    properties: mongoose.Schema.Types.Mixed,
    type: ResourceType
};

//A resource is just a resource ID with extra properties & some required fields.
//This so we can put one into a slot for a resourceId, and Mongoose will cast it for us.
var Resource =
    _.extend({
        owner: ResourceId,
        parent: ResourceId
    }, _.cloneDeep(ResourceId));

//Extra constraints for resources
Resource.uuid.required = true;
Resource.properties.default = {};
Resource.uuid.default = uuid.v1;
Resource.uuid.unique = true;
Resource.type.required = true;

function enforceDefaults(doc, uuidProperty, type, properties) {
    //convention to sync ids to resources.
    if (uuidProperty && doc.get(uuidProperty)) {
        doc.resource.uuid = doc.get(uuidProperty);
    }
    if (type) {
        doc.resource.type = type;
    }

    doc.resource.properties = doc.resource.properties || {};

    if(properties) {
        _.each(properties, function(property){
            doc.resource.properties[property] = doc[property];
        });
    }
}
function generateToken(){
  return crypto.createHash('sha1').update((new Date()).valueOf().toString() + Math.random().toString()).digest('base64');
}

function makeResourceObject( options ){

    var model = options.model, uuidProperty = options.uuidProperty;
    var resourceObject = _.cloneDeep(model);
    resourceObject.resource = {};

    if(options.includeProperties){
       resourceObject.resource.properties =  _.pick(_.cloneDeep(model), options.includeProperties);
    } else {
        resourceObject.resource.properties = _.cloneDeep(model);
    }

    resourceObject.resource.uuid = model[uuidProperty];
    resourceObject.resource.type = options.type || 'device';
    resourceObject.resource.owner = { uuid : model.owner, type : options.ownerType};
    return resourceObject;
}

function makeResourceModel(options) {
    var schema = options.schema,
        type = options.type,
        properties = options.properties,
        uuidProperty = options.uuidProperty;

    schema.add({resource: Resource});

    if (type || uuidProperty || properties) {
        //going into the database
        schema.pre('validate', function (next) {
            enforceDefaults(this, uuidProperty, type, properties);
            next();
        });

        //coming out of the database
        schema.post('init', function (doc) {
            enforceDefaults(doc, uuidProperty, type, properties);
        });
    }
    schema.virtual('resourceId').get(function () {
        return {
            uuid: this.resource.uuid,
            type: this.resource.type,
            properties: this.resource.properties
        };
    });

    schema.virtual('resource.owner.resourceId').get(function () {
        return {
            uuid: this.resource.owner.uuid,
            type: this.resource.owner.type,
            properties: this.resource.owner.properties
        };
    });

    schema.virtual('resource.parent.resourceId').get(function () {
        return {
            uuid: this.resource.parent.uuid,
            type: this.resource.parent.type,
            properties: this.resource.parent.properties
        };
    });

    schema.statics.generateToken = generateToken;
}


module.exports = {
    Resource: Resource,
    ResourceType: ResourceType,
    ResourceId: ResourceId,
    generateToken : generateToken,
    makeResourceModel: makeResourceModel,
    makeResourceObject : makeResourceObject
};
