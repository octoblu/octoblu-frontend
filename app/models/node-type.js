'use strict';

var mongoose = require('mongoose');

// define the schema for our user model
var NodeTypeSchema = new mongoose.Schema({
    name: {type: String, unique: true, index: 1},
    plugin: String,
    logo: String,
    description: String,
    skynet: {
        plugin: {type: String},
        type: {type: String},
        subtype: {type: String}
    },
    category: { type: String, enum: ['device', 'subdevice', 'channel', 'gateway'], index: 1},
    enabled: {type: Boolean, index: 1},
    display: {type: Boolean, index: 1},
    channel: {
        name             : String,
        owner            : String,
        description      : String,
        enabled          : Boolean,
        logo             : String,
        logobw           : String,
        auth_strategy    : String,
        custom_tokens    : [{name: String}],
        useCustom        : Boolean,
        oauth            : {
            version          : String
        },
        documentation: String,
        application: { base: String, resources: [] }
    }
});

module.exports = NodeTypeSchema;
