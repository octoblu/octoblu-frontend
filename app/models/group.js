'use strict';

var mongoose = require('mongoose');

// define the schema for our user model
var GroupSchema = mongoose.Schema({
    uuid: String,
    name: String,
    type: {
        type: String,
        default : 'Default',
        enum : ['Default', 'Operators']
    },
    permissions : {
        discover : Boolean,
        configure : Boolean,
        message : Boolean
    },
    members: [String],
    devices: [String]
});

mongoose.exports = GroupSchema;
