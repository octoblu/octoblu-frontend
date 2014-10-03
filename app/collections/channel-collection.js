var _        = require('lodash');
var when     = require('when');
var mongoose = require('mongoose');
var Channel  = require('../models/channel');

var ChannelCollection = function(options){
  var self = this;

  options  = options || {};
  mongoose = options.mongoose || mongoose;
  var User = mongoose.model('User');

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
      var api = _.findWhere(apis, {channelid: ""+channel._id});
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
