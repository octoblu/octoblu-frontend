'use strict';

var mongoose = require('mongoose');
var ResourceSchema = require('./resource');

// define the schema for our user model
var GroupSchema = mongoose.Schema({
    uuid: {type : String, required : true , index: true},
    name: String,
    owner : {type : mongoose.Schema.Types.ObjectId, required : true, index: true },
    type: {
        type: String,
        default : 'default',
        enum : ['default', 'operators', 'permissions'],
        required : true
    },
    members: [ResourceSchema]
});

mongoose.exports = GroupSchema;
