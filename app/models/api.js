'use strict';

var mongoose = require('mongoose');

// define the schema for our user model
var ApiSchema = new mongoose.Schema({

    name             : String,
    owner            : String,
    description      : String,
    enabled          : Boolean,
    logo             : String,
    logobw           : String,
    auth_strategy    : String, // options: oauth, simple (user enters token), custom (use custom tokens), none (requires no authorization)
    custom_tokens    : [{name: String}],
    useCustom        : Boolean,
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
        tokenMethod      : String,
        passTokenInQuery : Boolean,
        tokenQueryParam  : String,
        checkCSRFOnCallback: Boolean,
        auth_use_client_id_value    :String,
        auth_use_api_key :Boolean,
        is0LegAuth       :Boolean,
        accessToken  :String,
        accessSecret :String
    },
    documentation: String,
    application: { base: String, resources: [] }
});

ApiSchema.index({ name: 1 });
ApiSchema.index({ name: 1, enabled: 1 });

ApiSchema.statics.findByIds = function(ids){
    return db.api.find({_id: {$in: ids}});
};

module.exports = ApiSchema;
