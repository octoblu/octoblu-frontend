'use strict';

var mongoose = require('mongoose'),
    Resource = require('./mixins/resource');

// define the schema for our user model
var DeviceTypeSchema = new mongoose.Schema({
    name: String,
    plugin: String,
    logo: String,
    description: String,
    enabled: Boolean
});

Resource.makeResourceModel({schema: DeviceTypeSchema, type: 'devicetype'});

module.exports = DeviceTypeSchema;
