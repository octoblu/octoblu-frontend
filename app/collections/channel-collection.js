var _        = require('lodash');
var when     = require('when');
var Channel  = require('../models/channel');

var ChannelCollection = function(options){
  var self = this;

  options  = options || {};
  var User = require('../models/user');

  self.fetch = function(userUUID) {
    var userApis;
    return self.getUser(userUUID).then(function(user){
      var channelIds;

      userApis   = user.api;
      channelIds = _.compact(_.pluck(userApis, 'channelid'));

      return self.fetchChannelsByIds(channelIds);
    }).then(function(channels){
      return self.mergeChannelsAndApis(userApis, channels);
    });
  };

  self.fetchChannelsByIds = function(channelIds) {
    return Channel.findByIds(channelIds);
  };

  self.getUser = function(userUUID) {
    return User.findLeanBySkynetUUID(userUUID);
  };

  self.mergeChannelsAndApis = function(apis, channels){
    return _.map(channels, function(channel){
      var api = _.findWhere(apis, { type: channel.type });
      return {
        channelid : channel._id,
        channelActivationId : api._id,
        uuid: api.uuid,
        name : channel.name,
        type : channel.type
      };
    });
  };

  return self;
};

module.exports = ChannelCollection;
