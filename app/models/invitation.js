'use strict';

var mongoose = require('mongoose');

// define the schema for our user model
var InvitationSchema = mongoose.Schema({
   recipient : {
       email : String,
       uuid : String
   },
   from : String,
   group : String,
   status : String,
   sent : Date,
   completed : Date
},

    {
        collection : 'invitation'
    });

mongoose.model('Invitation', InvitationSchema);
