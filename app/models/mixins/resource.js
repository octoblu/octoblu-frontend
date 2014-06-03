'use strict';

var mongoose = require('mongoose');
var uuid = require('node-uuid');

// define the schema for our user model
var ResourceMixin = {
    uuid: {type : String, index : true, required: true, default: uuid.v1() },
    owner: {type : String, index : true },
    parent : { type : String, index : true },
    type: {
        type: String,
        default : 'device',
        enum : ['user', 'device', 'group'],
        required : true,
        index : true
    },
    properties: mongoose.Schema.Types.Mixed
};

module.exports = ResourceMixin;
