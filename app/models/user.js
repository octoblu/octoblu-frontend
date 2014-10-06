'use strict';

var mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  Resource = require('./mixins/resource'),
  moment = require('moment'),
  when = require('when'),
  _ = require('lodash'),
  uuid = require('node-uuid'),

  configAuth = require('../../config/auth')(process.env.NODE_ENV),
  rest = require('rest'),
  mime = require('rest/interceptor/mime'),
  errorCode = require('rest/interceptor/errorCode'),
  client = rest.wrap(mime).wrap(errorCode);

// define the schema for our user model
var UserSchema = new mongoose.Schema({
    name: String,
    username: String,
    displayName: String,
    email: String,
    admin: Boolean,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    terms_accepted_at: Date,
    testerId: String,
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
        uuid: {
          type: String,
          default: uuid.v1
        },
        channelid: String,
        authtype: String,
        key: String,
        token: String,
        user: String,
        pass: String,
        secret: String,
        verifier: String,
        subdomain: String,
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

Resource.makeResourceModel({schema: UserSchema, type: 'user', uuidProperty: 'skynetuuid', properties: ['displayName', 'email']});

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

UserSchema.methods.acceptTerms = function (termsAccepted) {
  var user = this;
  if (!termsAccepted) {
    return when.reject("termsAccepted must be true");
  }

  this.terms_accepted_at = new Date();

  return when.promise(function (resolve, reject) {
    user.save(function (error, user) {
      if (error) {
        return reject(error);
      }
      resolve(user);
    });
  });
};

UserSchema.methods.overwriteOrAddApiByChannelId = function (channelid, options) {
  var old_api, new_api;

  old_api = _.findWhere(this.api, {channelid: channelid});
  this.api = _.without(this.api, old_api);

  new_api = options || {};
  new_api.channelid = channelid;

  this.api.push(new_api);
};

UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.saveWithPromise = function () {
  return when.promise(function (resolve, reject) {
    this.save(function (error, user) {
      if (error) {
        return reject(error);
      }
      resolve(user);
    });
  });
};

UserSchema.methods.updatePassword = function (oldPassword, newPassword) {
  var user;
  user = this;
  return when.promise(function (resolve, reject) {
    if (!user.validPassword(oldPassword)) {
      reject('Password is invalid');
    }
    user.local.password = user.generateHash(newPassword);
    return user.saveWithPromise();
  });
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
UserSchema.statics.findOrCreateByEmailAndPassword = function(email, password){
  var self = this;

  return when.promise(function(resolve, reject){
    self.findByEmail(email).then(function(user){
      if(user && user.validPassword(password)){
        return resolve(user);
      };

      if(user) {
        return reject("User with that email address already exists");
      };

      var userParams = {
        email: email,
        local: {
          email: email,
          password: self.generateHash(password)
        }
      };

      return self.create(userParams);
    });
  });
};

UserSchema.statics.findByEmailAndPassword = function(email, password){
  var self = this;

  return when.promise(function(resolve, reject){
    self.findByEmail(email).then(function(user){
      try {
        if(user && user.validPassword(password)){
          return resolve(user);
        }
      } catch (error) {
        return reject(error);
      }

      return reject();
    });
  });
};

UserSchema.statics.findBySkynetUUID = function (skynetuuid) {
  return when(this.findOne({'skynet.uuid': skynetuuid}).exec());
};

UserSchema.statics.findLeanBySkynetUUID = function (skynetuuid) {
  return when(this.findOne({'skynet.uuid': skynetuuid}).lean().exec());
};

UserSchema.statics.findByEmail = function (email) {
  return when(this.findOne({ email: email }).exec());
};

UserSchema.statics.findByResetToken = function (resetToken) {
  var userQuery;

  userQuery = {
    resetPasswordToken: resetToken,
    resetPasswordExpires: { $gt: (new Date()) }
  };

  return when(this.findOne(userQuery).exec());
};

UserSchema.statics.findBySkynetUUIDAndToken = function (skynetuuid, skynettoken) {
  return when(this.findOne({'skynet.uuid': skynetuuid, 'skynet.token': skynettoken}).exec());
};

UserSchema.statics.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
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
