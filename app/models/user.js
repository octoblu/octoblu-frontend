'use strict';

var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    moment = require('moment'),
    groupSchema = require('./group');

// define the schema for our user model
var UserSchema = mongoose.Schema({
        name: String,
        username: String,
        admin: Boolean,
        local: {
            email: String,
            password: String,
            skynetuuid: String,
            skynettoken: String
        },
        facebook: {
            id: String,
            token: String,
            email: String,
            name: String,
            skynetuuid: String,
            skynettoken: String
        },
        twitter: {
            id: String,
            token: String,
            displayName: String,
            username: String,
            skynetuuid: String,
            skynettoken: String
        },
        google: {
            id: String,
            token: String,
            email: String,
            name: String,
            skynetuuid: String,
            skynettoken: String
        },
        api: [
            {
                name: String,
                authtype: String,
                key: String,
                token: String,
                secret: String,
                verifier: String,
                updated: {
                    type: Date,
                    default: Date.now
                },
                custom_tokens: [
                    {
                        name: String,
                        value: String
                    }
                ]
            }
        ],
        groups: [groupSchema]


    },
    { toObject: {virtuals: true}, toJSON: {virtuals: true} });

// find api connection by name
UserSchema.methods.findApiByName = function (name) {
    if (this.api == null && this.api == nil) {
        this.api = [];
    }

    for (var l = 0; l < this.api.length; l++) {
        if (this.api[l].name === name) {
            return this.api[l];
        }
    }

    return null;
};

UserSchema.methods.addOrUpdateApiByName = function (name, type, key, token, secret, verifier, custom_tokens) {
    if (this.api == null && this.api == nil) {
        this.api = [];
    }

    var isoDate = moment().format();

    for (var l = 0; l < this.api.length; l++) {
        if (this.api[l].name === name) {
            console.log('updating existing');
            this.api[l].key = key;
            this.api[l].authtype = type;
            this.api[l].token = token;
            this.api[l].secret = secret;
            this.api[l].verifier = verifier;
            this.api[l].updated = isoDate;
            this.api[l].custom_tokens = custom_tokens;

            return;
        }
    }

    // at this point the match wasn't found, so add it..
    var item = {
        name: name,
        authtype: type,
        key: key,
        token: token,
        secret: secret,
        verifier: verifier,
        custom_tokens: custom_tokens,
        updated: isoDate
    };

    console.log('adding');
    console.log(item);
    this.api.push(item);
};

// generating a hash
UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

//Convenience method for getting the Skynet UUID
UserSchema.virtual('skynetuuid').get(function () {
    return this.local.skynetuuid || this.google.skynetuuid || this.twitter.skynetuuid || this.facebook.skynetuuid;
});

//Convenience method for getting the Skynet Token
UserSchema.virtual('skynettoken').get(function () {
    return this.local.skynettoken || this.google.skynettoken || this.twitter.skynettoken || this.facebook.skynettoken;
});

mongoose.model('User', UserSchema);

module.exports = UserSchema;
