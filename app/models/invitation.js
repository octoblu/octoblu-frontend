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
   status : {
       type : String,
       default : 'PENDING',
       enum : ['PENDING' , 'ACCEPTED' ]
   },
   sent : Date,
   completed : Date
},
{
    collection : 'invitation'
});

module.exports = InvitationSchema;
