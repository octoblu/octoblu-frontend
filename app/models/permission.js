'use strict';

var mongoose = require('mongoose');

var PermissionSchema = mongoose.Schema({
   discover : { type : mongoose.Schema.Types.Boolean, required : true, default : false },
   receiveMsg : { type : mongoose.Schema.Types.Boolean, required : true, default : false },
   sendMsg : { type : mongoose.Schema.Types.Boolean, required : true, default : false },
   configure : { type : mongoose.Schema.Types.Boolean, required : true, default : false }
});

mongoose.exports = PermissionSchema;
