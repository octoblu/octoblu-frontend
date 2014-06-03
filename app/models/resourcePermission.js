'use strict';

var mongoose = require('mongoose');
// define the schema for our user model


var ResourcePermissionSchema = mongoose.Schema({
    grantedBy: { type: String, required: true, index: true },
    source: {type: String, required: true, index: true },
    target: {type: String, required: true, index: true },
    permission: {type: Object, required: true, default: {
        configure: false,
        discover: true,
        message: {
            send : false,
            receive : false
        }
    } }
});

module.exports = ResourcePermissionSchema;

