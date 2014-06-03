'use strict';

var mongoose = require('mongoose');
var PermissionSchema = require('./permission');
// define the schema for our user model


var ResourcePermissionSchema = mongoose.Schema({
    grantedBy : { type : String, required : true, index : true },
    source : {type : String, required : true , index : true },
    target : {type : String, required : true, index: true },
    permission : {type: PermissionSchema, required : true }
});


mongoose.model('ResourcePermission', ResourcePermissionSchema );


mongoose.exports = ResourcePermissionSchema;

