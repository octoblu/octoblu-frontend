'use strict';

var mongoose = require('mongoose');
// define the schema for our user model

var ResourceSchema = mongoose.Schema({
    name: {type: String, required: true },
    skynetuuid: {type : String, required : true },
    skynettoken: {type : String, required : true },
    owner: {type : String },
    type: {
        type: String,
        default : 'device',
        enum : ['user', 'device', 'group'],
        required : true
    },
    properties: mongoose.Schema.Types.Mixed
});

mongoose.exports = ResourceSchema;
