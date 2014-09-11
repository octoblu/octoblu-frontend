var _        = require('lodash');
var when     = require('when');
var mongoose = require('mongoose');

var ChannelCollection = function(options){
  var self = this;

  options  = options || {};
  mongoose = options.mongoose || mongoose;
  var Api  = mongoose.model('Api');
  var User = mongoose.model('User');

  self.fetch = function(userUUID) {
    var userApis;
    return self.getUser(userUUID).then(function(user){
      var channelIds;

      userApis   = user.api;
      channelIds = _.compact(_.pluck(userApis, 'channelid'));

      return self.fetchApisByIds(channelIds);
    }).then(function(apis){
      return self.mergeChannelsAndApis(userApis, apis);
    });
  };

  self.fetchApiById = function(channelId) {
    return Api.findByIds(channelId);
  };

  self.fetchApisByIds = function(channelIds) {
    return Api.findByIds(channelIds);
  };

  self.get = function(userUUID, channelId){
    var user;
    return self.getUser(userUUID).then(function(theUser){
      user = theUser;
      return self.fetchApiById(channelId);
    }).then(function(api){
      return {
        channelid: api._id,
        channelActivationId: user.api[0]._id,
        name: api.name
      }
    });
  };

  self.getUser = function(userUUID) {
    return User.findLeanBySkynetUUID(userUUID);
  };

  self.mergeChannelsAndApis = function(channels, apis){
    return _.map(apis, function(api){
      var channel = _.findWhere(channels, {channelid: ""+api._id});
      return {
        channelid : api._id,
        channelActivationId : channel._id,
        uuid: channel.uuid,
        name : api.name,
        type : api.type
      };
    });
  };

  return self;
};

module.exports = ChannelCollection;
