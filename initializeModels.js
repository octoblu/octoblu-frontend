//moved all the models initialization into here, because otherwise when we include the schema twice,
//mongoose blows up because the model is duplicated.

var mongoose = require('mongoose');

var ApiSchema = require('./app/models/api');
mongoose.model('Api', ApiSchema);

var ResourcePermissionSchema = require('./app/models/resourcePermission');
mongoose.model('ResourcePermission', ResourcePermissionSchema);

var DeviceTypeSchema = require('./app/models/device-type');
mongoose.model('DeviceType', DeviceTypeSchema);

var UserSchema = require('./app/models/user');
mongoose.model('User', UserSchema);

var EventSchema = require('./app/models/event');
mongoose.model('Event', EventSchema);

var GroupSchema = require('./app/models/group');
mongoose.model('Group', GroupSchema);

var InvitationSchema = require('./app/models/invitation');
mongoose.model('Invitation', InvitationSchema);