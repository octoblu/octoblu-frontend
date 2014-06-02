'use strict';

var mongoose = require('mongoose');
var ResourceSchema = require('./resource');
var uuid = require('node-uuid')
// define the schema for our user model
var GroupSchema = mongoose.Schema({
    uuid: {type : String, required : true , index: true, default: uuid.v1()},
    name: String,
    owner : {type : mongoose.Schema.Types.ObjectId, required : true, index: true },
    type: {
        type: String,
        default : 'default',
        enum : ['default', 'operators', 'permissions'],
        required : true
    },
    members: {type: Array, default: []}
});
GroupSchema.statics.updateProperties = ['name', 'members'];
GroupSchema.index({owner: 1, name: 1}, {unique: true});
mongoose.model('Group', GroupSchema);
mongoose.exports = GroupSchema;
