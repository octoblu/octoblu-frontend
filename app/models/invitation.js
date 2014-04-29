'use strict';

var mongoose = require('mongoose');

// define the schema for our user model
var invitationSchema = mongoose.Schema({
   recipient : {
       email : String,
       uuid : String
   },
   from : String,
   group : String,
   status : String,
   sent : Date,
   completed : Date
});

mongoose.model('Invitation', invitationSchema);

module.exports = invitationSchema;
