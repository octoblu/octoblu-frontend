'use strict';

var mongoose = require('mongoose');
// define the schema for our user model

var ResourcePropertySchema = mongoose.Schema({
    name :  {type : String, required : true },
    value : {type : mongoose.Schema.Types.Mixed, required : true}
});

var ResourceSchema = mongoose.Schema({
    uuid: {type : String, required : true },
    name: {type: String, required: true },
    type: {
        type: String,
        default : 'device',
        enum : ['user', 'device', 'group'],
        required : true
    },
    properties: [ResourcePropertySchema]
});

mongoose.exports = ResourceSchema;
