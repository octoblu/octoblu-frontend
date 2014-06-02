'use strict';

var mongoose = require('mongoose');
var ResourceSchema = require('./resource');
var PermissionSchema = require('./permission');
// define the schema for our user model


var ResourcePermissionSchema = mongoose.Schema({
    grantedBy : { type : ResourceSchema , required : true },
    source : {type : ResourceSchema, required : true },
    target : {type :ResourceSchema, required : true },
    permission : PermissionSchema
});


mongoose.model('ResourcePermission', ResourcePermissionSchema );

mongoose.exports = ResourcePermissionSchema;

