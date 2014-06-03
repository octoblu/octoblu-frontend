'use strict';

var mongoose = require('mongoose');

// define the schema for our user model
var DeviceSchema = mongoose.Schema({
    name: String,
    plugin: String,
    logo: String,
    description: String,
    enabled: Boolean
});

module.exports = DeviceSchema;
