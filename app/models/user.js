'use strict';
var octobluDB  = require('../lib/database');
var _          = require('lodash');
var when       = require('when');
var uuid       = require('node-uuid');
var bcrypt     = require('bcrypt');
var crypto     = require('crypto');
var configAuth = require('../../config/auth');
var request    = require('request');
var Channel    = require('./channel');
var debug      = require('debug')('octoblu:user');
var moment     = require('moment');

function UserModel() {
  var collection = octobluDB.getCollection('users');

  var methods = {
    createLocalUser : function(data){
      var self = this;

      var userParams = {
        email: data.email,
        local: {
          email: data.email,
          password: self.generateHash(data.password)
        }
      };
      return self.createUser(userParams);
    },

    createOAuthUser: function(data) {
      var self = this;
      return self.createUser(data);
    },

    createUser: function(data){
      var self = this;
      return self.registerWithMeshblu(data.email).then(function(skynetData){
        if (!skynetData.uuid) {
          throw new Error("Unable to register with Meshblu");
        }

        var userParams = _.extend({}, data, {
          resource: {
            type: 'user',
            uuid: skynetData.uuid
          },
          skynet: {
            uuid: skynetData.uuid,
            token: skynetData.token
          },
          api : [],
          created_at: moment().utc().toDate()
        });

        return self.insert(userParams).then(function(users){
          return _.first(users);
        });
      });
    },

    updateProfileBySkynetUUID: function(skynetuuid, profile) {
      var self = this;

      return self.findBySkynetUUID(skynetuuid)
        .then(function(user) {
          console.log(user);
        })
        .catch(function(error) {
          return when.reject('Error updating profile');
        });
    },


    findBySkynetUUID : function (skynetuuid) {
      var self = this;
      return self.findOne({'skynet.uuid': skynetuuid});
    },

    findByEmail : function (email) {
      var self = this;
      return self.findOne({ email: email });
    },

    findByResetToken : function (resetToken) {
      var self = this;
      var userQuery;

      userQuery = {
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: (new Date().getTime()) }
      };

      return self.findOne(userQuery);
    },

    findBySkynetUUIDAndToken : function (skynetuuid, skynettoken) {
      var self = this;
      return self.findOne({'skynet.uuid': skynetuuid, 'skynet.token': skynettoken});
    },

    generateHash : function (password) {
      var self = this;
      return bcrypt.hashSync(password, 8);
    },

    acceptTerms : function (user, termsAccepted) {
      var self = this;
      if (!termsAccepted) {
        throw new Error("termsAccepted must be true");
      }

      user.terms_accepted_at = new Date();
      return self.update({_id: user._id}, user);
    },

    addApiAuthorization: function(user, type, options) {
      var self = this;
      self.overwriteOrAddApiByChannelType(user, type, options);
      return self.update({_id: user._id}, user);
    },

    findApiByChannel : function(apis, channel){
      if (_.isString(channel.type)) {
        return this.findApiByChannelType(apis, channel.type);
      }
      return _.findWhere(apis, function(api){
        var channelid = api.channelid;
        if(channelid && !_.isString(channelid)){
          channelid = channelid.toString();
        }
        return channel._id === channelid;
      });
    },

    findApiByChannelType : function(apis, type) {
      return _.findWhere(apis, {type: type});
    },

    overwriteOrAddApi : function(user, channel, options){
      var self = this;
      var index, new_api, old_api, oldUuid;

      if (_.isUndefined(user.api)) {
        user.api = [];
      }

      index = _.findIndex(user.api, { type : channel.type });

      if(index > -1){
        old_api = user.api[index];
        oldUuid = old_api.uuid;
        user.api.splice(index, 1);
      }

      new_api = options || {};
      if(old_api && !new_api.defaultParams && old_api.defaultParams){
        new_api.defaultParams = old_api.defaultParams;
      }
      new_api.channelid = self.ObjectId(channel._id);
      new_api._id = self.ObjectId();

      new_api.type = channel.type;
      new_api.uuid = oldUuid || uuid.v1();

      user.api.push(new_api);
    },

    overwriteOrAddApiByChannelId : function (user, channelid, options) {
      var self = this;

      if(channelid && !_.isString(channelid)){
        channelid = channelid.toString();
      }

      var channel = Channel.syncFindById(channelid);

      self.overwriteOrAddApi(user, channel, options);
    },

    overwriteOrAddApiByChannelType : function (user, type, options) {
      var self = this;

      var channel = Channel.syncFindByType(type);

      self.overwriteOrAddApi(user, channel, options);
    },

    removeApiByChannelId: function(user, channelid){
      // Old channel activations used strings, new ones use ObjectIds
      user.api = _.reject(user.api, {channelid: channelid});
      user.api = _.reject(user.api, {channelid: this.ObjectId(channelid)});
      return this.update({_id: user._id}, user);
    },

    setResetPasswordToken: function(user){
      var self = this;
      user.resetPasswordToken = self.generateToken();
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      return self.update({_id: user._id}, user).then(function(){
        return user;
      });
    },

    updatePassword : function (user, oldPassword, newPassword) {
      var self = this;
      if (!self.validPassword(user, oldPassword)) {
        throw new Error('Password is invalid');
      }
      user.local.password = self.generateHash(newPassword);
      return self.update({_id: user._id}, user);
    },

    validPassword : function (user, password) {
      var self = this;
      return bcrypt.compareSync(password, user.local.password);
    },

    generateToken : function() {
      var self = this;
      return crypto.createHash('sha1').update((new Date()).valueOf().toString() + Math.random().toString()).digest('hex');
    },

    resetToken: function(uuid){
      var self = this;
      return self.findBySkynetUUID(uuid).then(function(user){
        return self.skynetRestRequest('/devices/' + user.skynet.uuid + '/token', true, 'POST', user.skynet.uuid, user.skynet.token);
      }).then(function(response){
        var token = response.token;
        return self.updateWithPromise({'skynet.uuid': uuid}, {$set: {'skynet.token': token}}).then(function(){
          return token;
        });
      }).catch(function(error){
        return when.reject('Token was reset, but not saved. You are in trouble.');
      });
    },

    skynetRestRequest: function(uri_fragment, json, method, auth_uuid, auth_token) {
      var self, uri, params;
      self = this;
      uri = 'http://' + configAuth.skynet.host + ':' + configAuth.skynet.port + uri_fragment;

      params = {
        uri: uri,
        json: json,
        method: method,
        headers: {
          'meshblu_auth_uuid': auth_uuid,
          'meshblu_auth_token': auth_token
        }
      };
      return when.promise(function(resolve, reject) {
        request(params, function(error, response, body) {
          if (error) {
            debug('request error:', error);
            reject(error);
            return;
          }
          if (response.statusCode >= 400) {
            reject('error ' + response.statusCode);
            return;
          }

          debug('request response', body);
          resolve(body);
        });
      })
    },

    registerWithMeshblu : function(email) {
      var self, uri_fragment, json;
      self = this;
      uri_fragment = '/devices';
      json = {
        type: 'user',
        email: email
      };

      return self.skynetRestRequest(uri_fragment, json, 'POST').then(function(data) {
        return self.setDefaultWhitelists(data)
      });
    },

    setDefaultWhitelists: function(data) {
      var self, uri_fragment, json, uuid;
      self = this;
      uuid = data.uuid;
      uri_fragment = '/devices/' + uuid;
      json = {
        configureWhitelist : [uuid],
        discoverWhitelist : [uuid]
      };

      return self.skynetRestRequest(uri_fragment, json, 'PUT', uuid, data.token).then(function(){
        return data;
      });
    }
  };

  var User = _.extend({}, collection, methods);
  User.updateWithPromise = when.lift(User.update);

  return User;
}

module.exports = new UserModel();
