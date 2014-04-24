'use strict';

var mongoose = require('mongoose')

// define the schema for our user model
var GroupSchema = mongoose.Schema({
    uuid: String,
    name: String,
    type: String,
    members: [{
        uuid: String
    }],
    devices: [{
        uuid: String
    }]
});
