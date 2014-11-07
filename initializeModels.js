//moved all the models initialization into here, because otherwise when we include the schema twice,
//mongoose blows up because the model is duplicated.

var mongoose = require('mongoose');

var UserSchema = require('./app/models/user');
mongoose.model('User', UserSchema);
