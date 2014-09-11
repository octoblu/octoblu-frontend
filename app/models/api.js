'use strict';

var mongoose = require('mongoose'),
  when = require('when');

// define the schema for our user model
var ApiSchema = new mongoose.Schema({
    name             : String,
    owner            : String,
    type             : String,
    description      : String,
    enabled          : Boolean,
    logo             : String,
    logobw           : String,
    auth_strategy    : String, // options: oauth, simple (user enters token), custom (use custom tokens), none (requires no authorization)
    custom_tokens    : [{name: String}],
    useCustom        : Boolean,
    isPassport       : Boolean,
    oauth            : {},
    documentation: String,
    application: { base: String, resources: [] }
});

ApiSchema.index({ name: 1 });
ApiSchema.index({ name: 1, enabled: 1 });

ApiSchema.statics.findByIds = function(ids){
    return when(this.find({_id: {$in: ids}}).lean().exec());
};

ApiSchema.statics.findAll = function(){
    return when(this.find().lean().exec());
};

module.exports = ApiSchema;
