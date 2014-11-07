//moved all the models initialization into here, because otherwise when we include the schema twice,
//mongoose blows up because the model is duplicated.

var mongoose = require('mongoose');

var ResourcePermissionSchema = require('./app/models/resourcePermission');
mongoose.model('ResourcePermission', ResourcePermissionSchema);

var UserSchema = require('./app/models/user');
mongoose.model('User', UserSchema);

var GroupSchema = require('./app/models/group');
mongoose.model('Group', GroupSchema);

