'use strict';

var mongoose = require('mongoose');

// define the schema for our user model
var ApiSchema = mongoose.Schema({

    name             : String,
    owner            : String,
    description      : String,
    enabled          : Boolean,
    logo             : String,
    logobw           : String,
    auth_strategy    : String, // options: oauth, simple (user enters token), custom (use custom tokens), none (requires no authorization)
    custom_tokens    : [{name: String}],
    oauth            : {
        key              : String,
        clientId         : String,
        secret           : String,
        accessTokenURL   : String,
        requestTokenURL  : String,
        authTokenURL     : String,
        version          : String,
        baseURL          : String,
        accessTokenPath  : String,
        authTokenPath    : String,
        isManual         : Boolean,
        host             : String,
        protocol         : String,
        grant_type       : String,
        authExtraQuery   : String,
        scope            : String,
        useOAuthParams   : Boolean,
        accessTokenIncludeClientInfo : Boolean,
        tokenMethod     : String
    },
    documentation: String,
    application: { base: String, resources: [] }
});

ApiSchema.index({ name: 1 });
ApiSchema.index({ name: 1, enabled: 1 });

mongoose.model('Api', ApiSchema);

module.exports = ApiSchema;
