'use strict';

var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    Resource = require('./mixins/resource'),
    moment = require('moment'),
    Q = require('q'),

    configAuth = require('../../config/auth')(process.env.NODE_ENV),
    rest = require('rest'),
    mime = require('rest/interceptor/mime'),
    errorCode = require('rest/interceptor/errorCode'),
    client = rest.wrap(mime).wrap(errorCode);

// define the schema for our user model
var UserSchema = new mongoose.Schema({
        name: String,
        username: String,
        displayName : String,
        email : String,
        admin: Boolean,
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        skynet: {
            uuid: {type: String, unique: true, required: true},
            token: { type: String, required: true}
        },
        local: {
            email: String,
            password: String
        },
        facebook: {
            id: String,
            token: String,
            email: String,
            name: String
        },
        twitter: {
            id: String,
            token: String,
            displayName: String,
            username: String
        },
        google: {
            id: String,
            token: String,
            email: String,
            name: String
        },
        github: {
            id: String
        },
        api: [
            {
                name: String,
                channelid: String,
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
        ]
    },
    { toObject: {virtuals: true}, toJSON: {virtuals: true} });

Resource.makeResourceModel({schema: UserSchema, type: 'user', uuidProperty: 'skynetuuid', properties: ['displayName', 'email', 'skynettoken']});

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

UserSchema.methods.addOrUpdateApiByChannelId = function (channelid, type, key, token, secret, verifier, custom_tokens) {
    this.api = this.api || [];

    var isoDate = moment().format();

    for (var l = 0; l < this.api.length; l++) {
        if (this.api[l].channelid == channelid) {
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
        channelid: channelid,
        authtype: type,
        key: key,
        token: token,
        secret: secret,
        verifier: verifier,
        custom_tokens: custom_tokens,
        updated: isoDate
    };

    this.api.push(item);
};

// generating a hash
UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.saveWithPromise = function(){
    var defer = Q.defer();
    this.save(function(error, user){
        if(error) {
          return defer.reject(error);
        }
        defer.resolve(user);
    });
    return defer.promise;
}

UserSchema.methods.updatePassword = function(oldPassword, newPassword){
    var defer, user;
    defer = Q.defer();
    user = this;

    if(!this.validPassword(oldPassword)) {
        defer.reject('Password is invalid')
        return defer.promise;
    }

    this.local.password = this.generateHash(newPassword);
    return user.saveWithPromise();
};

// checking if password is valid
UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};


//Convenience method for getting the Skynet UUID
//TODO: replace this with resource.uuid
UserSchema.virtual('skynetuuid').get(function () {
    return this.skynet.uuid || this.local.skynetuuid || this.google.skynetuuid || this.twitter.skynetuuid || this.facebook.skynetuuid;
});

//Convenience method for getting the Skynet Token
UserSchema.virtual('skynettoken').get(function () {
    return this.skynet.token || this.local.skynettoken || this.google.skynettoken || this.twitter.skynettoken || this.facebook.skynettoken;
});

////Convenience method for getting the Skynet Token
//UserSchema.virtual('email').get(function () {
//    return this.local.email || this.google.email || this.facebook.email || this.twitter.username + '@twitter';
//});
//
//UserSchema.virtual('displayName').get(function () {
//
//    return this.name || this.google.name || this.facebook.name || this.twitter.displayName || this.email;
//});

UserSchema.statics.findBySkynetUUID = function (skynetuuid) {
    return this.findOne({'skynet.uuid' : skynetuuid}).exec();
};

UserSchema.statics.findByEmail = function (email) {
    return Q(this.findOne({ email : email }).exec());
};

UserSchema.statics.findByResetToken = function(resetToken) {
    var userQuery;

    userQuery = {
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: (new Date()) }
    };

    return this.findOne(userQuery).exec();
};

UserSchema.statics.findBySkynetUUIDAndToken = function (skynetuuid, skynettoken) {
    return this.findOne({'skynet.uuid' : skynetuuid, 'skynet.token' : skynettoken}).exec();
};

UserSchema.pre('validate', function (next) {
    var user = this;
    user.skynet = user.skynet || migrateSkynet(user);
    if (!user.skynet.uuid) {
        user.skynet = {
            uuid: user.resource.uuid,
            token: Resource.generateToken()
        };

        client({
            method: 'POST',
            path: 'http://' + configAuth.skynet.host + ':' + configAuth.skynet.port + '/devices',
            params: {
                type: 'user',
                uuid: user.skynet.uuid,
                token: user.skynet.token,
                'email': user.email

            }
        }).then(function (result) {
                console.log(result.entity);
                next();
            })
            .catch(function (error) {
                next(error);
            });
    } else {
        next();
    }
});

module.exports = UserSchema;
