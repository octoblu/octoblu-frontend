'use strict';

var mongoose = require('mongoose'),
    Resource = require('./mixins/resource');

// define the schema for our user model
var DeviceTypeSchema = new mongoose.Schema({
    name: {type: String, unique: true, index: 1},
    plugin: String,
    logo: String,
    description: String,
    skynet : {
        plugin : {type : String},
        type : {type : String},
        subtype: {type: String}
    },
    enabled: {type: Boolean, index: 1}
});

Resource.makeResourceModel({schema: DeviceTypeSchema, type: 'devicetype'});

module.exports = DeviceTypeSchema;
