'use strict';

var mongoose = require('mongoose'),
    Resource = require('./mixins/resource');

// define the schema for our user model
var DeviceSchema = new mongoose.Schema({
    name: String,
    plugin: String,
    logo: String,
    description: String,
    enabled: Boolean
});

Resource.makeResource({schema: DeviceSchema, type: 'device'});

module.exports = DeviceSchema;
