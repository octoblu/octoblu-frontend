'use strict';

var mongoose = require('mongoose');

// define the schema for our user model
var EventSchema = mongoose.Schema({
    name: String,
    code: String,
    description: String
});

module.exports = EventSchema;
