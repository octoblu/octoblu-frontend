'use strict';

var mongoose = require('mongoose');

// define the schema for our user model
var InvitationSchema = mongoose.Schema({
   recipient : {
       email : mongoose.Schema.Types.String,
       uuid : mongoose.Schema.Types.String
   },
   from : mongoose.Schema.Types.String,
   group : mongoose.Schema.Types.String,
   status : mongoose.Schema.Types.String,
   sent : mongoose.Schema.Types.Date,
   completed : mongoose.Schema.Types.Date
},

    {
        collection : 'invitation'
    });

mongoose.model('Invitation', InvitationSchema);

module.exports = InvitationSchema;
